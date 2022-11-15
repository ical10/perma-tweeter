import React, { useState } from "react";

import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

type AppbarProps = {
  children?: React.ReactNode;
};

const Appbar = ({ children }: AppbarProps) => {
  const [walletAuthorized, setWalletAuthorized] = useState(false);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta | null>(null);

  const getAccounts = async () => {
    const extensions = await web3Enable("Perma-Tweeter dapp");
    if (extensions.length === 0) {
      return;
    }
    setWalletAuthorized(true);
    const allAccounts = await web3Accounts();
    setAccounts(allAccounts);
    setSelectedAccount(allAccounts[0]);
  };

  const handleConnect = () => {
    getAccounts();
  };

  const handleChangeAccount = () => {};

  const trimMiddleString = (text?: string, numberStringsKept = 5) => {
    if (!text) return "";
    const temp = `${text.slice(0, numberStringsKept)}...${text.slice(
      text.length - numberStringsKept
    )}`;

    return temp;
  };

  return (
    <div>
      <div className="bg-gray-400 flex flex-row p-2 justify-start items-center">
        <div className="mr-auto">Perma-Tweeter</div>
        {walletAuthorized && accounts.length ? (
          <button
            id="connect-button-with-address"
            onClick={handleChangeAccount}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            {trimMiddleString(selectedAccount?.address)}
          </button>
        ) : (
          <button
            id="connect-button"
            onClick={handleConnect}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            Connect Polkadot.js
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

export default Appbar;
