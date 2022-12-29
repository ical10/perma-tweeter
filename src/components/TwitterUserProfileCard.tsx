import { useEffect } from "react";
import clsx from "clsx";
import { Card, Avatar, Button } from "react-daisyui";
import { useTwitterUserStore } from "src/store";
import { TweetUserProps } from "src/types/common";

import { signOut, signIn } from "next-auth/react";

import { useSession } from "next-auth/react";

import { TWITTER_URL } from "src/configs/urls";

import LogoutIcon from "src/assets/LogoutIcon";

type TwitterUserProfileCardProps = {
  disabled: boolean;
  authenticatedUser?: TweetUserProps;
};

const TwitterUserProfileCard = ({ disabled, authenticatedUser }: TwitterUserProfileCardProps) => {
  const { data: session, status } = useSession();

  const { user, setNewUser } = useTwitterUserStore(state => ({
    user: state.user,
    setNewUser: state.setNewUser,
  }));

  useEffect(() => {
    if (authenticatedUser) {
      setNewUser({
        ...user,
      });
    }
  }, [authenticatedUser]);

  return (
    <Card className="flex h-fit flex-col rounded-[14px] bg-white shadow-md" bordered={false}>
      <Card.Body className="gap-4 md:gap-6">
        <h2
          className={clsx("text-lg font-bold text-neutral", {
            "text-disabled-gray": disabled,
          })}>
          1. Connect your Twitter account
        </h2>
        <div
          className={clsx("flex flex-row justify-start gap-4", {
            "justify-center": session && status === "authenticated" && authenticatedUser,
          })}>
          {session && status === "authenticated" && authenticatedUser ? (
            <>
              <div className="flex flex-row items-center justify-center gap-2">
                <Avatar src={authenticatedUser.profile_image_url} size="xs" shape="circle" />
                <div className="flex flex-col">
                  <a
                    className="font-semibold"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="#">{`${authenticatedUser.name}`}</a>
                  <a
                    className="font-normal text-gray-500"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${TWITTER_URL}/${authenticatedUser.username}`}>{`@${authenticatedUser.username}`}</a>
                </div>
              </div>
              <div className="ml-auto flex items-center justify-center">
                <Button
                  startIcon={LogoutIcon}
                  shape="square"
                  className="group btn btn-outline ml-auto w-fit border border-gray-500/[0.54] px-4 normal-case text-gray-500 hover:border-red-500/[0.54] hover:bg-white hover:text-red-500/[0.54] disabled:bg-transparent"
                  onClick={() =>
                    signOut({
                      callbackUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}/crosspost`,
                    })
                  }>
                  <p className="hidden md:block">Disconnect</p>
                </Button>
              </div>
            </>
          ) : (
            <Button
              className={clsx("border-0 normal-case", {
                "btn btn-disabled": disabled,
                "btn-gradient btn": !disabled,
              })}
              onClick={() =>
                signIn("twitter", {
                  callbackUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}/crosspost`,
                })
              }>
              Connect Twitter
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TwitterUserProfileCard;
