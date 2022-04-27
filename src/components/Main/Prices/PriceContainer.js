import { TokenPerTokenPrice } from "./TokenPerTokenPrice";
import { formatEther } from "ethers/lib/utils";

export const PriceContainer = ({ price }) => (
  <div className="price-container">
    <h2>Prices</h2>
    <div className="prices">
      <TokenPerTokenPrice
        token1={"ETH"}
        token2={"UNI"}
        price={Number(formatEther(price?.ethPerUNISwapPrice)).toPrecision(6)}
      />
      <TokenPerTokenPrice
        token1={"UNI"}
        token2={"ETH"}
        price={Number(formatEther(price?.uniPerETHSwapPrice)).toPrecision(6)}
      />
    </div>
  </div>
);
