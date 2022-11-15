import type { NextPage, GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { authOptions } from "pages/api/auth/[...nextauth]";
import FullScreenLoading from "src/components/FullScreenLoading";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import AuthButton from "src/components/Button";
import { unstable_getServerSession } from "next-auth/next";
import Image from "next/image";
import { useSubSocialApiHook } from "src/hooks/use-subsocial-api";
import { TweetsProps } from "src/types/common";
const Appbar = dynamic(() => import("src/components/Appbar"), {
  ssr: false,
});

const TweetPage: NextPage<TweetsProps> = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { initApi, loading, postTransaction } = useSubSocialApiHook();
  //const [savedPosts, setSavedPosts] = useState<PostProps[]>([]);

  //useEffect(() => {
  //if (savedPosts.length > 0 && session) {
  //initApi({ mnemonic: session.mnemonic });
  //}
  //}, [savedPosts.length, session]);

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
          <div className="flex flex-row max-h-screen p-4">
            <div className="flex flex-col overflow-y-auto overflow-x-hidden"></div>
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

export default TweetPage;
