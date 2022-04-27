import "./App.scss";
import Header from "./layouts/Header";
import Main from "./layouts/Main";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

function App() {
  const getLibrary = (provider) => {
    const library = new Web3Provider(provider);
    library.pollingInterval = 8000;
    return library;
  };
  return (
    <>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Header />
        <Main />
      </Web3ReactProvider>
    </>
  );
}

export default App;
