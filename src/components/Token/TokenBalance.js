import { formatEther } from "ethers/lib/utils";

const TokenBalance = ({ onClick, balance }) => {
  return (
    <div className="token-balance-and-button">
      <span className="token-balance">
        {balance ? formatEther(balance) : "0.0000"}
        <span></span>
      </span>
      <button className="max" onClick={onClick}>
        max
      </button>
    </div>
  );
};

export default TokenBalance;
