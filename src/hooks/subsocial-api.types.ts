import { PostProps, TweetWithAuthorProps } from "src/types/common";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

export type PostTransactionProps = {
  savedPosts: PostProps[];
  account: InjectedAccountWithMeta;
};

export type CreateSpaceProps = {
  account: InjectedAccountWithMeta;
  content: TweetWithAuthorProps;
  successCallback?: (props: SuccessPayloadProps) => void;
};

export type CreatePostWithSpaceIdProps = {
  spaceId: string;
  account: InjectedAccountWithMeta;
  content: TweetWithAuthorProps;
  successCallback?: (props: SuccessPayloadProps) => void;
};

export type SuccessPayloadProps = {
  postId: string;
  spaceId: string;
};
