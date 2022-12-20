import initializeApi from "src/lib/SubsocialApi";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import type { SubsocialApi } from "@subsocial/api";
import { bnsToIds } from "@subsocial/utils";
import type { SpaceData } from "@subsocial/api/types";
import { getNewIdsFromEvent } from "@subsocial/api/utils";

import { useState } from "react";
import { IpfsContent } from "@subsocial/api/substrate/wrappers";
import { Keyring } from "@polkadot/keyring";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import toast from "react-hot-toast";

import {
  PostTransactionProps,
  CreateSpaceProps,
  CreatePostWithSpaceIdProps,
} from "./subsocial-api.types";

export const useSubSocialApiHook = () => {
  const [subsocialApi, setSubsocialApi] = useState<SubsocialApi | null>(null);
  const [spaces, setSpaces] = useState<SpaceData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [loadingCreatePost, setLoadingCreatePost] = useState(false);
  const [successTx, setSuccessTx] = useState<string | null>(null);

  const initApi = async (mnemonic?: string): Promise<void> => {
    if (mnemonic) {
      const api = await initializeApi(mnemonic);
      setSubsocialApi(api);
    } else {
      const api = await initializeApi();
      setSubsocialApi(api);
    }
  };

  const createSpaceWithTweet = async ({ account, content }: CreateSpaceProps) => {
    setLoading(true);

    const toastId = toast.loading("Loading...", {
      style: {
        minWidth: "300px",
      },
    });

    try {
      const { web3Enable, web3FromSource } = await import("@polkadot/extension-dapp");

      const extensions = await web3Enable("SubTweet dapp");

      if (!extensions) return null;

      const injector = await web3FromSource(account.meta.source);

      const author = content.users?.find(user => user.id === content.author_id);

      const cid = await subsocialApi?.ipfs.saveContent({
        title: `Tweet by ${author?.name}`,
        body: content.text,
        tags: [author?.name, author?.username, author?.profile_image_url],
        canonical: `https://twitter.com/${author?.username}/status/${content.id}`,
      });

      const substrateApi = await subsocialApi?.blockchain.api;

      if (!substrateApi) return new Error("Error when calling substrateApi");

      const tx = substrateApi.tx.spaces.createSpace(IpfsContent(cid), null);

      tx.signAndSend(
        account.address,
        {
          signer: injector.signer,
        },
        async result => {
          const { status } = result;

          if (!result || !status) {
            return;
          }

          if (status.isFinalized || status.isInBlock) {
            const blockHash = status.isFinalized ? status.asFinalized : status.asInBlock;

            console.log(`✅ createSpaceWithTweet finalized. Block hash: ${blockHash.toString()}`);
            toast.success("Tx successful!", { id: toastId });
            setSuccessTx(blockHash.toString());
          } else if (result.isError) {
            console.log(JSON.stringify(result));
          } else {
            console.log(`⏱ Current tx status: ${status.type}`);
            toast(`⏱ Current tx status: ${status.type}`, {
              id: toastId,
            });
          }
        },
      );
    } catch (error) {
      console.warn({ error });
    } finally {
      setLoading(false);
    }
  };

  const checkSpaceOwnedBy = async (account: InjectedAccountWithMeta) => {
    setLoadingSpaces(true);

    try {
      const subsocialApi = await initializeApi();

      if (!subsocialApi) return null;

      const spaceIds = await subsocialApi.blockchain.spaceIdsByOwner(account.address);

      if (!spaceIds) return null;

      const spaces = await subsocialApi.findPublicSpaces(bnsToIds(spaceIds));
      if (spaces) {
        setSpaces(spaces);
      }

      if (spaces && !spaces.length) {
        setSpaces(null);
      }
    } catch (error) {
      console.warn({ error });
    } finally {
      setLoadingSpaces(false);
    }
  };

  const createPostWithSpaceId = async ({
    content,
    spaceId,
    account,
    successCallback,
  }: CreatePostWithSpaceIdProps) => {
    setLoadingCreatePost(true);

    const toastId = toast.loading("Loading...", {
      style: {
        minWidth: "300px",
      },
    });

    try {
      const { web3Enable, web3FromSource } = await import("@polkadot/extension-dapp");

      const extensions = await web3Enable("SubTweet dapp");

      const subsocialApi = await initializeApi();

      if (!subsocialApi) return null;

      if (!extensions) return null;

      const injector = await web3FromSource(account.meta.source);

      const author = content.users?.find(user => user.id === content.author_id);

      const cid = await subsocialApi.ipfs.saveContent({
        title: `Tweet by ${author?.name}`,
        tags: [author?.name, author?.username, author?.profile_image_url],
        body: content.text,
        canonical: `https://twitter.com/${author?.username}/status/${content.id}`,
      });

      const substrateApi = await subsocialApi.blockchain.api;

      if (!substrateApi) return new Error("Error when calling substrateApi");

      const tx = substrateApi.tx.posts.createPost(spaceId, { RegularPost: null }, IpfsContent(cid));

      tx.signAndSend(
        account.address,
        {
          signer: injector.signer,
        },
        async result => {
          const { status } = result;

          if (!result || !status) {
            setLoadingCreatePost(false);
            return;
          }

          if (status.isFinalized || status.isInBlock) {
            const blockHash = status.isFinalized ? status.asFinalized : status.asInBlock;

            console.log(`✅ createPostWithSpaceId finalized. Block hash: ${blockHash.toString()}`);
            setLoadingCreatePost(false);
            setSuccessTx(blockHash.toString());
            const ids = getNewIdsFromEvent(result);
            const postId = bnsToIds(ids)[0];

            successCallback &&
              successCallback({
                postId,
                spaceId,
              });
          } else if (result.isError) {
            console.log(JSON.stringify(result));
          } else {
            console.log(`⏱ Current tx status: ${status.type}`);
            toast(`⏱ Current tx status: ${status.type}`, {
              id: toastId,
            });
          }
        },
      );
    } catch (error) {
      console.warn({ error });
    }
  };

  const postTransaction = async ({ savedPosts, mnemonic }: PostTransactionProps) => {
    setLoadingCreatePost(true);
    try {
      await cryptoWaitReady();

      const keyring = new Keyring({ type: "sr25519" });
      const pair = keyring.addFromMnemonic(mnemonic);

      //Use already made space by current pair
      const spaceId = "1018";

      const substrateApi = await subsocialApi?.blockchain.api;

      if (!substrateApi) return new Error("Error when calling substrateApi");

      if (savedPosts.length === 1) {
        //Init creating single post tx
        const singlePostCid = await subsocialApi?.ipfs.saveContent({
          title: "My exported tweet",
          image: null,
          tags: ["exported tweet", "perma-tweet"],
          body: savedPosts[0].text,
          canonical: savedPosts[0].url,
        });

        const postTx = substrateApi.tx.posts.createPost(
          spaceId,
          { RegularPost: null },
          IpfsContent(singlePostCid),
        );

        postTx.signAndSend(pair, async result => {
          const { status } = result;

          if (!result || !status) {
            setLoadingCreatePost(false);
            return;
          }

          if (status.isFinalized || status.isInBlock) {
            const blockHash = status.isFinalized ? status.asFinalized : status.asInBlock;

            console.log(`✅ singleCreatePostTx finalized. Block hash: ${blockHash.toString()}`);
            setLoadingCreatePost(false);
          } else if (result.isError) {
            console.log(JSON.stringify(result));
          } else {
            console.log(`⏱ Current tx status: ${status.type}`);
            setLoadingCreatePost(true);
          }
        });
      } else {
        //Init creating batchTx for posts
        let result: any[] = [];

        for (const savedPost of savedPosts) {
          const cid = await subsocialApi?.ipfs.saveContent({
            title: "My exported tweets",
            //TODO: able to add image
            image: null,
            tags: ["exported tweet", "perma-tweet"],
            body: savedPost.text,
            canonical: savedPost.url,
          });
          result.push([spaceId, { RegularPost: null }, IpfsContent(cid)]);
        }

        const submittablePosts: any[] = [];

        for (const element of result) {
          const [spaceId, regularPost, content] = element;
          const tx = substrateApi.tx.posts.createPost(spaceId, regularPost, content);
          submittablePosts.push(tx);
        }

        const batchTx = substrateApi.tx.utility.batch(submittablePosts);

        if (!batchTx) throw new Error("batchTx creation error!");

        batchTx.signAndSend(pair, async result => {
          const { status } = result;

          if (!result || !status) {
            setLoadingCreatePost(false);
            return;
          }

          if (status.isFinalized || status.isInBlock) {
            const blockHash = status.isFinalized ? status.asFinalized : status.asInBlock;

            console.log(`✅ batchCreatePostTx finalized. Block hash: ${blockHash.toString()}`);
            setLoadingCreatePost(false);
          } else if (result.isError) {
            console.log(JSON.stringify(result));
          } else {
            setLoadingCreatePost(true);
            console.log(`⏱ Current tx status: ${status.type}`);
          }
        });
      }
    } catch (err) {
      console.log({ err });
    }
  };

  return {
    subsocialApi,
    loading,
    initApi,
    createSpaceWithTweet,
    createPostWithSpaceId,
    successTx,
    spaces,
    loadingSpaces,
    loadingCreatePost,
    checkSpaceOwnedBy,
    postTransaction,
  };
};
