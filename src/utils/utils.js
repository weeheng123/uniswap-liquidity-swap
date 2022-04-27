import { parseEther } from "ethers/lib/utils";

export const truncateAddress = (address) => {
  if (!address) return "No Account";
  let tempAddress;
  if (address) {
    if (address.length > 20) {
      tempAddress =
        address.substr(0, 4) +
        "..." +
        address.substr(address.length - 4, address.length);
    }
  }
  return tempAddress;
};

export const handleEtherChange = (event) => {
  const { value } = event.target;

  if (
    value !== "." &&
    +value < Number.MAX_SAFE_INTEGER &&
    value.match("^[0-9]*[.]?[0-9]*$")
  ) {
    onchange(event);
  }
};

export const onInputChange = async (
  event,
  setValueState,
  setInputState,
  tokenOnePerTwoPrice,
  tokenTwoPerOnePrice
) => {
  const { name, value } = event.target;
  if (name === "ETH") {
    event.preventDefault();
    if (!value) {
      setInputState(false);
      return;
    }

    console.log(parseEther(value).mul(tokenOnePerTwoPrice));
    setInputState(true);
    setValueState({
      ethDisplay: value,
      uniDisplay: (value * tokenOnePerTwoPrice) / 10 ** 18,
      ethAmount: parseEther(value),
      uniAmount: parseEther(value)
        .mul(tokenOnePerTwoPrice)
        .div(parseEther("1")),
    });
  } else {
    event.preventDefault();
    if (!value) {
      setInputState(false);
      return;
    }
    setInputState(true);
    setValueState({
      ethDisplay: (value * tokenTwoPerOnePrice) / 10 ** 18,
      uniDisplay: value,
      ethAmount: parseEther(value)
        .mul(tokenTwoPerOnePrice)
        .div(parseEther("1")),
      uniAmount: parseEther(value),
    });
  }
};
