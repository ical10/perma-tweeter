import Identicon from "@polkadot/react-identicon";
import { IconTheme } from "@polkadot/react-identicon/types";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import React from "react";

type ReactIdenticonProps = {
  account: InjectedAccountWithMeta;
  size?: number;
  theme?: IconTheme;
};

const ReactIdenticon = (props: ReactIdenticonProps) => {
  const { account, size = 32, theme = "substrate" } = props;
  const address = account.address;

  return (
    <Identicon
      value={address}
      size={size}
      theme={theme}
      className="!cursor-pointer rounded-full border border-[#d8d8d9]"
    />
  );
};

export default ReactIdenticon;
