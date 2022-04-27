import TokenBalance from "./TokenBalance";
import TokenInput from "./TokenInput";

const TokenContainer = ({ amount, inputState, onChange, token, balance }) => {
  return (
    <div className="token">
      <TokenInput
        amount={amount}
        inputState={inputState}
        onChange={onChange}
        token={token}
      />
      <TokenBalance balance={balance} />
    </div>
  );
};

export default TokenContainer;
