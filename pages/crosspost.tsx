import type { NextPage, GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import Head from "next/head";
import { authOptions } from "pages/api/auth/[...nextauth]";
import FullScreenLoading from "src/components/FullScreenLoading";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import AuthButton from "src/components/Button";
import { unstable_getServerSession } from "next-auth/next";
import { useSubSocialApiHook } from "src/hooks/use-subsocial-api";
import { TweetProps } from "src/types/common";
const Appbar = dynamic(() => import("src/components/Appbar"), {
  ssr: false,
});

const CrossPostPage: NextPage<TweetProps> = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { initApi, loading, postTransaction } = useSubSocialApiHook();

  const [tweetUrl, setTweetUrl] = useState("");
  const [loadingTweet, setLoadingTweet] = useState(false);
  const [fetchedTweet, setFetchedTweet] = useState<TweetProps | null>(null);

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

  const handleSignAnSubmit = async () => {
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

      const data = await response.json();

      setFetchedTweet(data);
    } catch (error) {
      console.warn({ error });
    } finally {
      setLoadingTweet(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTweetUrl(event.target.value);
  };

  return (
    <>
      <Head>
        <title>Perma-Tweeter - Cross-post Tweet</title>
        <meta name="description" content="Store your Tweet, permanently" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Appbar>
        <div className="flex flex-row items-center justify-center max-w-full max-h-screen">
          <div className="flex flex-col self-start mt-4 p-4 gap-2 max-w-[500px]">
            <AuthButton text={"Logout"} />
            <a>{`Welcome! You are logged in as @${session.user.name}`}</a>
          </div>
          <div>
            <h2>Cross-post a tweet into Subsocial</h2>
            {fetchedTweet ? (
              <div
                key={fetchedTweet.id}
                className="p-6 max-w-lg bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-blue-500 dark:hover:bg-blue-500
                flex flex-col items-center mb-4"
              >
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
            {fetchedTweet ? (
              <button>Send post to Subsocial</button>
            ) : (
              <button disabled={loadingTweet} onClick={handleSignAnSubmit}>
                {loadingTweet ? "Fetching tweet..." : "Find tweet"}
              </button>
            )}
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
