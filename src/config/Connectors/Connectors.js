import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const injected = new InjectedConnector({
  supportedChainIds: [1, 4],
});

const walletconnect = new WalletConnectConnector({
  rpcUrl: process.env.REACT_APP_INFURA_API,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

export const connectors = {
  injected: injected,
  walletConnect: walletconnect,
};
