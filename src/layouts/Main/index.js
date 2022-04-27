import "./index.scss";
import TokenContainer from "../../components/Token/TokenContainer";
import SwapHeader from "../../components/Main/SwapHeader";
import { LogoDown } from "../../assets/LogoDown";
import { PriceContainer } from "../../components/Main/Prices/PriceContainer";
import { useEffect, useState, useRef } from "react";
import {
  executionPrice,
  getAmountOutMinHex,
  getTokenBalance,
} from "../../utils/web3utils";
import { useWeb3React } from "@web3-react/core";
import { formatEther, parseEther } from "ethers/lib/utils";
import { onInputChange } from "../../utils/utils";
import { swapTokens } from "../../utils/web3utils";

const Main = () => {
  const { library, account } = useWeb3React();
  const [price, setPrice] = useState({
    ethPerUNISwapPrice: parseEther("0"),
    uniPerETHSwapPrice: parseEther("0"),
  });
  const [amount, setAmount] = useState({
    ethAmount: parseEther("0"),
    uniAmount: parseEther("0"),
  });
  const [balance, setBalance] = useState({
    ethTokenBalance: parseEther("0"),
    uniTokenBalance: parseEther("0"),
  });
  const [minimumAmount, setMinimumAmount] = useState("0.00000");
  const [inputState, setInputState] = useState(false);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    const getPairPrice = async () => {
      setPrice(await executionPrice(library));
    };
    getPairPrice();
    const fetchTokenBalance = async () => {
      setBalance(await getTokenBalance(library));
    };
    fetchTokenBalance();
    const fetchMinimumAmount = async () => {
      if (!amount.ethAmount.isZero()) {
        const { amountOutMinHex } = await getAmountOutMinHex(
          library,
          amount.ethAmount
        );
        console.log(amountOutMinHex);
        if (isMounted.current) {
          setMinimumAmount(formatEther(amountOutMinHex));
        }
      }
    };
    fetchMinimumAmount();

    return () => {
      isMounted.current = false;
    };
  }, [library, amount.ethAmount]);

  return (
    <div className="container">
      <section className="swap" ref={isMounted}>
        <SwapHeader />
        <TokenContainer
          token={"ETH"}
          amount={amount?.ethDisplay}
          inputState={inputState}
          onChange={(event) =>
            onInputChange(
              event,
              setAmount,
              setInputState,
              price.ethPerUNISwapPrice,
              price.uniPerETHSwapPrice
            )
          }
          balance={balance?.ethTokenBalance}
        />
        <LogoDown />
        <TokenContainer
          token={"UNI"}
          amount={amount?.uniDisplay}
          inputState={inputState}
          onChange={(event) =>
            onInputChange(
              event,
              setAmount,
              setInputState,
              price.ethPerUNISwapPrice,
              price.uniPerETHSwapPrice,
              library,
              setMinimumAmount
            )
          }
          balance={balance?.uniTokenBalance}
        />
        <PriceContainer price={price} />
        <button
          onClick={() => swapTokens(library, amount.ethAmount, account)}
          className="swap-button"
        >
          Swap
        </button>
        <span className="minimum-amount">Minimum Amount: {minimumAmount}</span>
      </section>
    </div>
  );
};

export default Main;
