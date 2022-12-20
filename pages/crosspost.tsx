import type { NextPage, GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import React, { useCallback, useState, useEffect, useRef } from "react";
import Head from "next/head";
import Identicon from "src/components/Identicon";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { TweetWithAuthorProps } from "src/types/common";
import FullScreenLoading from "src/components/FullScreenLoading";
import { useSession } from "next-auth/react";
import { useWalletStore } from "src/store";
import { unstable_getServerSession } from "next-auth/next";
import { useSubSocialApiHook } from "src/hooks/use-subsocial-api";
import { SuccessPayloadProps } from "src/hooks/subsocial-api.types";
import TwitterUserProfileCard from "components/TwitterUserProfileCard";
import { TwitterApi } from "twitter-api-v2";
import { AuthenticatedPageProps } from "src/types/common";
import FetchTweetForm from "src/components/FetchTweetForm";
import SendTweetCard from "src/components/SendTweetCard";
import toast, { Toaster } from "react-hot-toast";
import { Button, Card } from "react-daisyui";

import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

import { trimMiddleString } from "src/utils/string";

import { TwitterShareButton } from "react-share";

import { explorerUrl } from "src/configs/sdk-network-config";

import XIcon from "src/assets/XIcon.svg";

const Layout = dynamic(() => import("src/components/Layout"), {
  ssr: false,
});

const CrossPostPage: NextPage = ({ user }: Partial<AuthenticatedPageProps>) => {
  const { status } = useSession();

  const { successTx } = useSubSocialApiHook();
  const { account } = useWalletStore(state => ({
    account: state.account,
  }));

  useEffect(() => {
    if (successTx) {
      toast.custom(
        <div className="color-[#363636] pointer-events-auto flex min-w-[300px] items-center justify-center gap-2 rounded-lg bg-white py-[8px] px-[10px] leading-normal text-black shadow will-change-transform">
          ✅{" "}
          <div className="m-auto">
            <a target="_blank" rel="noopener noreferrer" href={`${explorerUrl}/${successTx}`}>
              Tx succesful!
            </a>{" "}
          </div>
        </div>,
      );
    }
  }, [successTx]);

  const [fetchedTweet, setFetchedTweet] = useState<TweetWithAuthorProps | null>(null);

  const handleSetFetchedTweet = (fetchedTweet: TweetWithAuthorProps | null) => {
    setFetchedTweet(fetchedTweet);
  };

  const [contentId, setContentId] = useState<SuccessPayloadProps | undefined>();

  const handleSuccessSendTweet = useCallback(({ spaceId, postId }: SuccessPayloadProps) => {
    setContentId({
      postId,
      spaceId,
    });
  }, []);

  if (status === "loading") return <FullScreenLoading />;

  return (
    <>
      <Head>
        <title>SubTweet - Cross-post Tweet</title>
        <meta name="description" content="Store your Tweet, permanently" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div className="h-screen max-w-full px-4 lg:grid lg:grid-cols-[0.5fr_1fr_0.5fr]">
          <Toaster position="bottom-right" />
          <div></div>
          <div className="mt-4 flex flex-col gap-4">
            <TwitterUserProfileCard
              disabled={!Boolean(account) || Boolean(user)}
              authenticatedUser={user}
            />

            <FetchTweetForm
              disabled={!Boolean(user) || Boolean(fetchedTweet)}
              onFetchTweet={handleSetFetchedTweet}
            />

            <SendTweetCard
              disabled={(!Boolean(account) && !Boolean(user)) || !Boolean(fetchedTweet)}
              fetchedTweet={fetchedTweet}
              onSuccess={handleSuccessSendTweet}
            />
          </div>
          <div></div>
        </div>

        <Dialog
          open={Boolean(contentId)}
          handler={() => setContentId(undefined)}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.5, y: 50 },
          }}
          className="min-w-fit max-w-fit rounded-2xl px-5 py-5 backdrop-blur-[1px] md:min-w-[520px] md:max-w-[520px] md:p-6 lg:min-w-[30%] lg:p-8">
          <DialogHeader className="flex flex-col items-center justify-center gap-2 p-0">
            <div className="flex w-full flex-row items-center justify-end px-0 text-xl font-bold leading-7 text-[#222222] md:text-2xl">
              <div className="ml-auto">🎉 Tweet published</div>
              <div onClick={() => setContentId(undefined)} className="ml-auto cursor-pointer">
                <XIcon />
              </div>
            </div>
            <div className="text-base font-normal leading-[140%] text-[#585858]">
              Tweet successfully saved to the blockchain!
            </div>
          </DialogHeader>
          <DialogBody className="px-0 md:pt-6 md:pb-4">
            <Card bordered={false} className="rounded-lg border border-[#d9d9d9] bg-white">
              <Card.Body className="max-w-full gap-4 p-4 md:gap-6 md:p-6">
                <div className="flex flex-row items-center justify-center gap-2 self-start">
                  <Identicon />
                  <div>
                    <div className="font-bold text-neutral">{account?.meta.name}</div>
                    <div className="font-normal text-gray-500">
                      {trimMiddleString(account?.address)}
                    </div>
                  </div>
                </div>
                <p className="text-base font-normal text-neutral">
                  I just cross-posted this tweet to the{" "}
                  <a
                    className="link link-hover whitespace-nowrap text-[#316CF4]"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://twitter.com/SubsocialChain">
                    @SubsocialChain
                  </a>{" "}
                  network to make it censorship resistant!{" "}
                  <a
                    className="link link-hover text-[#316CF4]"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://polkaverse.com/${contentId?.spaceId}/${contentId?.postId}`}>
                    {`https://polkaverse.com/${contentId?.spaceId}/${contentId?.postId}`}
                  </a>
                  <br />
                  <br />
                  <a className="link whitespace-nowrap text-[#316CF4] no-underline" href="#">
                    #Subsocial
                  </a>
                </p>
              </Card.Body>
            </Card>
          </DialogBody>
          <DialogFooter className="flex flex-col gap-4 p-0">
            <TwitterShareButton
              className="btn-gradient btn w-full"
              url={`https://polkaverse.com/${contentId?.spaceId}/${contentId?.postId}\n`}
              hashtags={["Subsocial"]}
              title={`I just cross-posted this tweet to the @SubsocialChain network to make it censorship resistant!\n\n`}>
              <span className="text-base font-medium text-white">Tweet about it!</span>
            </TwitterShareButton>
            <Button
              onClick={() => setContentId(undefined)}
              className="btn btn-outline btn-accent w-full whitespace-nowrap rounded-lg normal-case">
              <span>Cross-post another tweet</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </Layout>
    </>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let session = await unstable_getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      props: {},
    };
  }

  const { token } = session;

  if (!token) throw new Error("Token not defined!");

  const twitterClient = new TwitterApi(token);

  // Tell typescript it's a readonly app
  const readOnlyClient = twitterClient.readOnly;

  const { id } = session?.user;
  const { data: user } = await readOnlyClient.v2.user(id, {
    "user.fields": ["id", "name", "profile_image_url"],
  });

  return {
    props: { user },
  };
}

export default CrossPostPage;
