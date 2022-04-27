import { ethers, BigNumber } from "ethers";
import {
  ChainId,
  Token,
  WETH,
  Fetcher,
  Trade,
  Route,
  TokenAmount,
  TradeType,
  Percent,
} from "@uniswap/sdk";
import UNITokenABI from "../config/abi/UNITokenABI.json";
import UniV2RouterABI from "../config/abi/UniswapV2RouterABI.json";
import { parseEther, formatEther } from "ethers/lib/utils";

export const pairAddress = "0x4e99615101ccbb83a462dc4de2bc1362ef1365e5";
export const wethAddress = "0xc778417e063141139fce010982780140aa0cd5ab";
export const uniAddress = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
export const uniV2RouterAddress = "0x7a250d5630b4cf539739df2c5dacb4c659f2488d";
export const ethPerUniDecimalDisplacement = 10 ** 14;
export const uniPerETHDecimalDisplacement = 10 ** 16;
export const slippageTolerance = new Percent("50", "10000"); //0.5%

const UNI = new Token(ChainId.RINKEBY, uniAddress, 18);
export const fetchPairPrice = async (library) => {
  const provider = library;

  const contract = new ethers.Contract(
    pairAddress,
    [
      "function getReserves() external view returns(uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
      "function token0() external view returns (address)",
      "function token1() external view returns (address)",
    ],
    provider
  );
  const reserves = await contract.getReserves();

  return {
    ethPerUNIPrice: reserves.reserve1.mul(10 ** 15).div(reserves.reserve0),
    uniPerETHPrice: reserves.reserve0.mul(10 ** 15).div(reserves.reserve1),
  };
};

export const getNetwork = (chainId) => {
  if (chainId === 1) {
    return "Mainnet";
  } else {
    return "Rinkeby";
  }
};

export const executionPrice = async (library) => {
  const pair = await Fetcher.fetchPairData(WETH[UNI.chainId], UNI, library);
  const route = new Route([pair], WETH[UNI.chainId]);
  const trade = new Trade(
    route,
    new TokenAmount(WETH[UNI.chainId], parseEther("1.0")),
    TradeType.EXACT_INPUT
  );

  return {
    ethPerUNISwapPrice: BigNumber.from(
      parseEther(trade.executionPrice.toSignificant(14))
    ),
    uniPerETHSwapPrice: BigNumber.from(
      parseEther((1 / trade.executionPrice.toSignificant(14)).toString())
    ),
  };
};

export const getTokenBalance = async (library) => {
  try {
    const provider = library;
    await provider.send("eth_requestAccounts", []);
    const uniTokenContract = new ethers.Contract(
      uniAddress,
      UNITokenABI,
      provider
    );
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    let uniBalance = await uniTokenContract.balanceOf(signerAddress);
    let ethBalance = await provider.getBalance(signerAddress);
    return { ethTokenBalance: ethBalance, uniTokenBalance: uniBalance };
  } catch (error) {
    console.log(error);
  }
};

export const swapTokens = async (library, ethAmount, account) => {
  try {
    const { trade, amountOutMinHex } = await getAmountOutMinHex(
      library,
      ethAmount
    );

    const path = [wethAddress, uniAddress];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const inputAmount = trade.inputAmount.raw;
    const inputAmountHex = BigNumber.from(inputAmount.toString()).toHexString();
    alert("Minimum amount: " + formatEther(amountOutMinHex));

    const signer = await library.getSigner();
    const routerContract = new ethers.Contract(
      uniV2RouterAddress,
      UniV2RouterABI,
      signer
    );
    const gasPrice = await library.getGasPrice();

    await routerContract.swapExactETHForTokens(
      amountOutMinHex,
      path,
      account.toLowerCase(),
      deadline,
      {
        value: inputAmountHex,
        gasPrice,
        gasLimit: BigNumber.from(150000).toHexString(),
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const getAmountOutMinHex = async (library, ethAmount) => {
  const pair = await Fetcher.fetchPairData(WETH[UNI.chainId], UNI, library);
  const route = new Route([pair], WETH[UNI.chainId]);
  const trade = new Trade(
    route,
    new TokenAmount(WETH[UNI.chainId], ethAmount),
    TradeType.EXACT_INPUT
  );
  const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
  const amountOutMinHex = BigNumber.from(amountOutMin.toString()).toHexString();
  return { trade, amountOutMinHex };
};
