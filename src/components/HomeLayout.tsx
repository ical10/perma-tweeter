import Head from "next/head";
import SubTweet from "src/assets/SubTweet.svg";

import React from "react";

import styles from "styles/home-layout.module.css";

type HomeLayoutProps = {
  children: React.ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div style={{ position: "relative" }}>
      <Head>
        <title>SaveTweet - Landing Page</title>
        <meta
          name="description"
          content="Back up your tweets to Subsocial’s censorship resistant network"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <SubTweet />
        <button className="btn-gradient btn w-[121px] rounded-xl">Enter App</button>
      </header>
      <main className={styles.main}>
        <>{children}</>
        <footer className={styles.footer}>
          <SubTweet />
        </footer>
      </main>

      <div className="absolute bottom-0 left-0 h-[109px] w-full bg-white"></div>
    </div>
  );
};

export default HomeLayout;
