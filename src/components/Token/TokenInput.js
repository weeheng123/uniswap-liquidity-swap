const TokenInput = ({ amount, inputState, onChange, token }) => {
  const handleEtherChange = (event) => {
    const { value } = event.target;

    if (
      value !== "." &&
      +value < Number.MAX_SAFE_INTEGER &&
      value.match("^[0-9]*[.]?[0-9]*$")
    ) {
      onChange(event);
    }
  };

  return (
    <div className="token-input-and-button">
      <input
        className="token-input"
        placeholder="0"
        onChange={handleEtherChange}
        value={inputState ? amount : ""}
        name={token}
      ></input>
      <span className="token-name">{token}</span>
    </div>
  );
};

export default TokenInput;
