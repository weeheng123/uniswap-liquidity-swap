import "./index.scss";
import { Uniswap } from "../../assets/Uniswap";
import { useWeb3React } from "@web3-react/core";
import { connectors } from "../../config/Connectors/Connectors";
import { useCallback, useEffect } from "react";
import { truncateAddress } from "../../utils/utils";
import { getNetwork } from "../../utils/web3utils";
import {
  useSafeAppConnection,
  SafeAppConnector,
} from "@gnosis.pm/safe-apps-web3-react";

const Header = () => {
  const safeMultisigConnector = new SafeAppConnector();
  const { activate, deactivate, active, account, chainId } = useWeb3React();
  const triedToConnectToSafe = useSafeAppConnection(safeMultisigConnector);

  const setProvider = useCallback((type) => {
    window.localStorage.setItem("provider", type);
  }, []);

  const connectWallet = useCallback(async () => {
    await activate(connectors.injected);
    setProvider("Metamask");
  }, [activate, setProvider]);

  const disconnect = useCallback(() => {
    deactivate();
  }, [deactivate]);

  useEffect(() => {
    if (triedToConnectToSafe) {
      connectWallet();
    }

    return () => {
      disconnect();
    };
  }, [connectWallet, disconnect, triedToConnectToSafe]);

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
