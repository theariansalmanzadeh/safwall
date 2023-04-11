import { useState } from "react";
import IUniswapV3PoolArtifact from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import IUniswapV3FactoryArtifact from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json";
import SwapRouterABI from "@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json";
import WETHABI from "../Weth-atrifacts/weth-artifacts.json";
import { useWeb3Ctx } from "../components/Web3Provider";
import { ethers } from "ethers";
import { abi } from "../utils/variables";
import {
  UNISWAP_ROUTER_ADDRESS,
  UNISWAP_FACTORY_ADDRESS,
} from "../utils/variables";

const useSwap = () => {
  const { provider, userWallet } = useWeb3Ctx();
  const [decimals1, setDecimals1] = useState(null);
  const [decimals2, setDecimals2] = useState(null);

  const getPrice = async (poolContract) => {
    const slot0 = await poolContract.slot0();
    return slot0;
  };
  const getTokensDecimals = async (token1, token2) => {
    const contractTK1 = new ethers.Contract(token1, WETHABI.abi, provider);
    const contractTK2 = new ethers.Contract(token2, abi, provider);

    const wallet = userWallet.connect(provider);

    const decimals1 = await contractTK1.connect(wallet).decimals();
    const decimals2 = await contractTK2.connect(wallet).decimals();
    setDecimals1(decimals1);
    setDecimals2(decimals2);

    return {
      decimals1,
      decimals2,
    };
  };
  const getPoolAddress = async (token1, token2) => {
    const fee = 3000;

    const factoryContract = new ethers.Contract(
      UNISWAP_FACTORY_ADDRESS,
      IUniswapV3FactoryArtifact.abi,
      provider
    );
    const poolAddress = await factoryContract.getPool(token1, token2, fee);

    return poolAddress;
  };
  const getToken0 = async (poolContract) => {
    const token0 = await poolContract.token0();
    return token0;
  };
  const setPoolContract = (poolAddress) => {
    const poolContractUnsinged = new ethers.Contract(
      poolAddress,
      IUniswapV3PoolArtifact.abi,
      provider
    );
    const wallet = userWallet.connect(provider);

    const poolContract = poolContractUnsinged.connect(wallet);

    return poolContract;
  };
  const changeTokenOrder = (token0, token1, token2) => {
    if (token0 === token1) {
      return { correctToken1: token1, correctToken2: token2 };
    } else {
      return { correctToken1: token2, correctToken2: token1 };
    }
  };

  const calculatePrice = async (poolAddress, token1, token2) => {
    const poolContract = setPoolContract(poolAddress);
    const slot0 = await getPrice(poolContract);
    const token0 = await getToken0(poolContract);
    const { correctToken1, correctToken2 } = changeTokenOrder(
      token0,
      token1,
      token2
    );

    const { decimals1, decimals2 } = await getTokensDecimals(
      correctToken1,
      correctToken2
    );

    const numerator = slot0[0] ** 2;
    const denominator = 2 ** 192;
    let ratio = numerator / denominator;
    const shiftDecimals = Math.pow(10, decimals1 - decimals2);
    ratio *= shiftDecimals;
    ratio = token0 === token1 ? ratio : 1 / ratio;
    return ratio;
  };
  const executeSwap = async (amountIn, token1, token2) => {
    const fee = 3000;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 2;

    const routerContract = new ethers.Contract(
      UNISWAP_ROUTER_ADDRESS,
      SwapRouterABI.abi,
      provider
    );
    const wallet = userWallet.connect(provider);
    const params = {
      tokenIn: token1,
      tokenOut: token2,
      fee: fee,
      recipient: wallet.address,
      deadline: deadline,
      amountIn: amountIn,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    };

    const dataIn = routerContract.interface.encodeFunctionData(
      "exactInputSingle",
      [params]
    );

    const tx = await wallet.sendTransaction({
      to: UNISWAP_ROUTER_ADDRESS,
      from: wallet.address,
      value: amountIn,
      data: dataIn,
      gasLimit: "1000000",
    });
    console.log("ok2");
    const res = await tx.wait();
    return res;
  };

  return {
    getPrice,
    getTokensDecimals,
    getPoolAddress,
    calculatePrice,
    executeSwap,
    decimals1,
    decimals2,
  };
};

export default useSwap;
