import type { NextPage, GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { authOptions } from "pages/api/auth/[...nextauth]";
import FullScreenLoading from "src/components/FullScreenLoading";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import AuthButton from "src/components/Button";
import { unstable_getServerSession } from "next-auth/next";
import { useSubSocialApiHook } from "src/hooks/use-subsocial-api";
import { TweetWithAuthorProps } from "src/types/common";
const Appbar = dynamic(() => import("src/components/Appbar"), {
  ssr: false,
});

const CrossPostPage: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { initApi, loading, postTransaction } = useSubSocialApiHook();

  const [tweetUrl, setTweetUrl] = useState("");
  const [loadingTweet, setLoadingTweet] = useState(false);
  const [fetchedTweet, setFetchedTweet] = useState<TweetWithAuthorProps | null>(
    null
  );

  if (status === "loading") return <FullScreenLoading />;

  if (status === "unauthenticated")
    return (
      <div>
        <p>Access unauthorized, please login first</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => router.push("/")}
        >
          Go back to login
        </button>
      </div>
    );

  if (!session) return null;

  const handleFetchTweet = async () => {
    setLoadingTweet(true);

    try {
      const { token } = session;
      const tweetId = tweetUrl.split("/")[5];

      const response = await fetch("/api/crosspost", {
        method: "POST",
        body: JSON.stringify({ tweetId, token }),
        headers: {
          "Content-type": "application/json",
        },
      });

      const { data, includes } = await response.json();

      const { author_id, edit_history_tweet_ids, id, text } = data;
      const { users } = includes;

      const payload = {
        author_id,
        edit_history_tweet_ids,
        id,
        text,
        users,
      };

      setFetchedTweet(payload);
    } catch (error) {
      console.warn({ error });
    } finally {
      setLoadingTweet(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTweetUrl(event.target.value);
  };

  const handleClearUrl = () => {
    setTweetUrl("");
  };

  const getAuthor = (tweet: TweetWithAuthorProps) => {
    const temp = tweet.users?.find((user) => user.id === tweet.author_id);

    return {
      temp,
    };
  };

  return (
    <>
      <Head>
        <title>Perma-Tweeter - Cross-post Tweet</title>
        <meta name="description" content="Store your Tweet, permanently" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Appbar>
        <div className="grid grid-cols-[0.75fr_1.75fr_0.75fr] max-w-full max-h-screen">
          <div className="flex flex-col self-start mt-4 p-4 gap-2">
            <AuthButton text={"Logout"} />
            <a>{`Welcome! You are logged in as @${session.user.name}`}</a>
          </div>

          <div className="flex flex-col max-h-screen p-4">
            <h2>Cross-post a tweet into Subsocial</h2>
            {fetchedTweet ? (
              <div
                key={fetchedTweet.id}
                className="p-6 max-w-lg bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-blue-500 dark:hover:bg-blue-500
                flex flex-col items-center mb-4"
              >
                <div className="flex flex-row items-center self-start justify-center gap-2">
                  <Image
                    src={getAuthor(fetchedTweet).temp?.profile_image_url ?? ""}
                    alt="user-avatar"
                    className="rounded-full"
                    width="32"
                    height="32"
                  />
                  <div>
                    <div>
                      {getAuthor(fetchedTweet).temp?.name ?? "Twitter user"}
                    </div>
                    <div>
                      {`@${getAuthor(fetchedTweet).temp?.username}` ??
                        "@username"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start py-2 px-4">
                  {fetchedTweet.text}
                </div>
              </div>
            ) : (
              <></>
            )}
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Tweet URL
            </label>
            <input
              type="text"
              id="tweet-url"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="https://twitter.com/cat_auras/status/1592442883424276486"
              value={tweetUrl}
              onChange={handleChange}
              required
            />
            <div>
              <button
                className="disabled:bg-gray-300 disabled:hover:bg-gray-100 text-red font-bold py-2 px-4 rounded"
                disabled={!tweetUrl}
                onClick={handleClearUrl}
              >
                Clear URL
              </button>
              <button
                className="bg-blue-500 disabled:bg-gray-300 disabled:hover:bg-gray-100 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={loadingTweet || !tweetUrl}
                onClick={handleFetchTweet}
              >
                {loadingTweet ? "Fetching tweet..." : "Find tweet"}
              </button>
            </div>
          </div>

          <div>Space owned by: {}</div>

          <div className="flex flex-col self-start items-center justify-center mt-4 p-4 gap-2">
            <button
              className="bg-blue-500 disabled:bg-gray-300 disabled:hover:bg-gray-100 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={!fetchedTweet}
              //onClick={handlePostTransaction}
            >
              Send post to Subsocial!
            </button>
            <a>{loading ? "Sending tx, open your console" : ""}</a>
            <a>Find tweet first to be sent</a>
          </div>
        </div>
      </Appbar>
    </>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let session = await unstable_getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default CrossPostPage;
