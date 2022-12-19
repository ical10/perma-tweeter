import React, { useState } from "react";
import Link from "next/link";
import { useWalletStore } from "src/store";

import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

import ReactIdenticon from "src/components/ReactIdenticon";
import SubTweet from "src/assets/SubTweet.svg";
import NewLogoPolkadot from "src/assets/NewLogoPolkadot.svg";
import ST from "src/assets/ST.svg";
import ThreeHorizontalLines from "src/assets/ThreeHorizontalLines.svg";
import Sidebar from "./Sidebar";

import { useRouter } from "next/router";

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const {
    account,
    setAccount,
    readyAccounts,
    setAccounts: setReadyAccounts,
  } = useWalletStore(state => ({
    account: state.account,
    setAccount: state.setAccount,
    readyAccounts: state.accounts,
    setAccounts: state.setAccounts,
  }));

  const router = useRouter();

  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>(readyAccounts);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(account);
  const [isOpen, setIsOpen] = useState(false);

  const getAccounts = async () => {
    const extensions = await web3Enable("SubTweet dapp");
    if (extensions.length === 0) {
      return;
    }
    const allAccounts = await web3Accounts();
    setAccounts(allAccounts);
    setReadyAccounts(allAccounts);

    setSelectedAccount(allAccounts[0]);
    setAccount(allAccounts[0]);
  };

  const handleConnect = () => {
    getAccounts();
  };

  const handleChangeAccount = (account: InjectedAccountWithMeta | null) => {
    setSelectedAccount(account);
    setAccount(account);

    setIsOpen(false);
  };

  return (
    <>
      <Sidebar
        checked={isOpen}
        onCheck={() => setIsOpen(false)}
        accounts={accounts ?? []}
        onChangeAccount={handleChangeAccount}>
        <div>
          <div className="navbar bg-base-100">
            <div className="navbar-start">
              <div className="dropdown">
                <label tabIndex={0} className="btn btn-ghost hover:bg-transparent lg:hidden">
                  <ThreeHorizontalLines />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow">
                  <li>
                    <Link
                      href="/tweets"
                      legacyBehavior
                      className="-mb-1 flex items-center border-b-2 px-4 py-4 dark:border-transparent">
                      <a rel="noopener noreferrer" href="#">
                        Tweets
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/crosspost"
                      legacyBehavior
                      className="-mb-1 flex items-center border-b-2 px-4 py-4 dark:border-transparent">
                      <a rel="noopener noreferrer" href="#">
                        Crosst-post
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
              <button onClick={() => router.push("/crosspost")}>
                <span className="text-2xl font-medium text-primary text-[#6A8CEC]">
                  <div className="hidden md:inline">
                    <SubTweet />
                  </div>
                  <div className="md:hidden">
                    <ST />
                  </div>
                </span>
              </button>
            </div>
            <div className="navbar-center hidden lg:flex">
              <ul className="mx-auto hidden items-stretch space-x-3 md:flex">
                <li className="hover:text-grey-500 flex">
                  <Link
                    href="/tweets"
                    legacyBehavior
                    className="-mb-1 flex items-center border-b-2 px-4 py-4 dark:border-transparent">
                    <a
                      rel="noopener noreferrer"
                      href="#"
                      className={`-mb-1 flex items-center border-b-2 px-4 py-4 hover:text-light-blue ${
                        router.pathname === "/tweets"
                          ? "border-accent text-accent"
                          : "border-transparent"
                      }`}>
                      Feeds
                    </a>
                  </Link>
                </li>
                <li className="hover:text-grey-500 flex">
                  <Link
                    href="/crosspost"
                    legacyBehavior
                    className="-mb-1 flex items-center border-b-2 px-4 py-4 dark:border-transparent">
                    <a
                      rel="noopener noreferrer"
                      href="#"
                      className={`-mb-1 flex items-center border-b-2 px-4 py-4 hover:text-light-blue ${
                        router.pathname === "/crosspost"
                          ? "border-accent text-accent hover:text-accent"
                          : "border-transparent"
                      }`}>
                      Cross-post a tweet
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="navbar-end">
              {accounts && accounts.length && selectedAccount ? (
                <button
                  className="btn btn-ghost text-base font-normal normal-case hover:bg-[#f1f3f4]"
                  onClick={() => setIsOpen(!isOpen)}>
                  <div className="flex items-center justify-center gap-2">
                    <ReactIdenticon account={selectedAccount} />
                    <div>{account?.meta.name}</div>
                  </div>
                </button>
              ) : (
                <button
                  id="connect-button"
                  onClick={handleConnect}
                  className="btn gap-2 border-0 bg-gradient-to-r from-primary to-secondary normal-case">
                  <NewLogoPolkadot />
                  Connect wallet
                </button>
              )}
            </div>
          </div>
        </div>
        <main>{children}</main>
      </Sidebar>
    </>
  );
};

export default Layout;
