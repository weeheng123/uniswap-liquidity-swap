import "./index.scss";
import { Uniswap } from "../../assets/Uniswap";
import { useWeb3React } from "@web3-react/core";
import { connectors } from "../../config/Connectors/Connectors";
import { useCallback, useEffect } from "react";
import useIsMounted from "../../hooks/CustomHooks/useIsMounted";
import { truncateAddress } from "../../utils/utils";
import { getNetwork } from "../../utils/web3utils";

const Header = () => {
  const { activate, deactivate, active, account, chainId } = useWeb3React();
  const isMounted = useIsMounted();

  const setProvider = useCallback((type) => {
    window.localStorage.setItem("provider", type);
  }, []);

  const connectWallet = useCallback(async () => {
    await activate(connectors.injected);
    setProvider("Metamask");

    console.log("activated");
  }, [activate, setProvider]);

  const disconnect = useCallback(() => {
    deactivate();
    console.log("deactivated");
  }, [deactivate]);

  useEffect(() => {
    if (isMounted) {
      connectWallet();
    }

    return () => {
      if (!isMounted) {
        disconnect();
      }
    };
  }, [connectWallet, disconnect, isMounted]);

  return (
    <div className="container">
      <header className="header">
        <Uniswap />
        <span className="title">Uniswap Liquidity Swap</span>
        <div className="network">
          <span>{active ? getNetwork(chainId) : "Network"}</span>
          <span
            className="connect-wallet"
            onClick={
              !active
                ? () => {
                    connectWallet();
                  }
                : () => {
                    disconnect();
                  }
            }
          >
            {active ? truncateAddress(account) : "Connect Wallet"}
          </span>
        </div>
      </header>
    </div>
  );
};

export default Header;
