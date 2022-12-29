import type { NextPage } from "next";
import HomeLayout from "src/components/HomeLayout";
import clsx from "clsx";
import styles from "styles/index.module.css";

import AppButton from "components/AppButton";

const customH2 = "text-[2rem] font-medium leading-[2.8rem] font-unbounded";
const customP = "text-[1.25rem] font-medium leading-[2rem]";

const customBaseCard = "rounded-[57px] bg-white";
const customBaseInnerCard = "rounded-[30px] border border-[#c6cdd0] px-[22.5px] py-[24px]";

type StepsCardProps = {
  id: string;
  text: string;
  imageUrl: string;
};

export const StepsCard = ({ id, text, imageUrl }: StepsCardProps) => {
  return (
    <div className={clsx(customBaseInnerCard, "flex flex-row items-center gap-[1.5rem]")}>
      <div>
        <p className={styles.coloredDigit}>{id}</p>
      </div>
      <div>
        <p className={clsx(customP)}>{text}</p>
      </div>
      <div className="ml-auto">
        <img src={imageUrl} alt={`${imageUrl}-description`} className="h-auto w-[245px]" />
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const stepsDetail: StepsCardProps[] = [
    {
      id: "1",
      text: "Simply connect your wallet and Twitter account",
      imageUrl: "/Step1.png",
    },
    {
      id: "2",
      text: "Paste the link of the tweet you wish to cross-post",
      imageUrl: "/Step2.png",
    },
    {
      id: "3",
      text: "Select a space to post it in",
      imageUrl: "/Step3.png",
    },
    {
      id: "4",
      text: "Sign the transaction",
      imageUrl: "/Step4.png",
    },
  ];

  return (
    <HomeLayout>
      <div className="w-full max-w-[1261px]">
        <div className="mb-[61px]">
          <div className="my-[121px] flex w-full flex-row items-center justify-between">
            <div className="pr-24">
              <h1 className="mb-[1.5rem] font-unbounded text-[2.5rem] font-medium leading-[3.5rem]">
                Back up your tweets to Subsocial’s censorship resistant network
              </h1>
              <AppButton size={"medium"} text="Enter App" />
            </div>

            <img
              src="/BigMultiCircles.svg"
              className="sm:w-[50%] lg:w-[549px]"
              alt="big-multi-lines"
            />
          </div>

          <div className="flex flex-col gap-[1.25rem]">
            <div className={clsx(customBaseCard, "relative")}>
              <img
                src="/SmallMeridianLines.svg"
                className="absolute bottom-0 w-[30%] md:w-[40%] lg:w-[382px]"
                alt="small-meridian-lines"
              />
              <div className="grid grid-cols-[33%_66%] justify-between pr-[41px]">
                <div className="w-[30%] md:w-[40%] lg:w-[382px]"></div>
                <div className="pt-[59px] pb-[74px]">
                  <h2 className={clsx(customH2, styles.coloredGradient, "mb-[40px]")}>
                    You don’t own your content on Twitter
                  </h2>
                  <p className={clsx(customP, "mb-[43px]")}>
                    In fact, Twitter can remove your content at will, or even ban you, permanently
                    deleting all of your tweets.
                    <br />
                    <br />
                    With SubTweet, you can easily cross-post your tweets to Subsocial’s
                    decentralized network. This means your content is stored on a
                    censorship-resistant blockchain – your tweets will live forever.
                  </p>
                  <AppButton size={"large"} text="Save Tweets" />
                </div>
              </div>
            </div>

            <div className={clsx(customBaseCard, "p-[3.75rem]")}>
              <h2 className={clsx(customH2, styles.coloredGradient, "mb-[40px] text-center")}>
                How it works
              </h2>
              <div className="mb-[40px] flex flex-col gap-[1.5rem]">
                {stepsDetail.map(step => (
                  <StepsCard key={step.id} id={step.id} text={step.text} imageUrl={step.imageUrl} />
                ))}
              </div>
              <div className="text-center">
                <AppButton size={"large"} text="Connect" />
              </div>
            </div>

            <div className={clsx(customBaseCard, "flex flex-col p-[3.75rem]")}>
              <h2 className={clsx(customH2, styles.coloredGradient, "mb-[24px] text-center")}>
                Feature suggestions
              </h2>
              <p className="mb-[40px] text-center text-[1.5rem] font-medium leading-[190%]">
                If you have any feature ideas for the app, please let us know.
              </p>
              <div className="text-center">
                <AppButton size={"large"} text="Suggest Features" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default Home;
