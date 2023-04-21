import React, { useRef, useState } from "react";
import { ethers } from "ethers";
import { useWeb3Ctx } from "./Web3Provider";
import { backgroundMode } from "../utils/helper";
import SelectTokenModal from "./SelectTokenModal.js";
import useSwap from "../hooks/useSwap";
import styles from "../styles/sass/pages/SwapSeciotn.module.scss";
import { ImSpinner8 } from "react-icons/im";
import { defaultToken } from "../utils/variables";
import { useAccountCtx } from "../stores/accountProvider";
import { getBalace } from "../utils/helper";

function Swap() {
  const { lightMode, provider, userWallet } = useWeb3Ctx();
  const { togglePageRefresh } = useAccountCtx();
  const { getPoolAddress, calculatePrice, executeSwap } = useSwap();

  const [isTokenSelected, SetIsTokenSelected] = useState({
    name: null,
    logoSrc: null,
    contractAddress: "",
  });
  const [selectToken, SetSelectToken] = useState(false);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAllowedLoading, setIsAllowedLoading] = useState(false);
  const [isSwapLoading, setIsSwapLoading] = useState(false);
  const [balance, setBalance] = useState("");
  const [error, setError] = useState(false);
  const [priseInpactError, setPriseInpactError] = useState(false);

  const buyTokenRef = useRef();
  const EthInputRef = useRef();

  const classes = backgroundMode(styles.swapSection, styles.dark, lightMode);

  const selectTokenHandler = async () => {
    SetSelectToken(true);
  };
  const fetchTokenHandler = async (token2Address) => {
    setIsLoading(true);

    const poolAddress = await getPoolAddress(defaultToken, token2Address);
    const priceRatio = await calculatePrice(
      poolAddress,
      defaultToken,
      token2Address
    );

    setTokenPrice(priceRatio);
    setIsLoading(false);
  };

  const changeInputHandler = async () => {
    const valueIn = EthInputRef.current.value;
    const valueOut = valueIn * tokenPrice;

    setPriseInpactError(false);
    setError(false);

    if (valueIn > 0.5) {
      setPriseInpactError(true);
      return;
    }
    setIsAllowedLoading(true);
    buyTokenRef.current.value = valueOut.toFixed(3);
    let balance = await getBalace(provider, userWallet.connect(provider));
    setBalance(balance);

    balance = Number(balance);

    if (valueIn > balance) {
      setError(true);
    } else {
      setError(false);
    }
    setIsAllowedLoading(false);
  };

  const swapHanlder = async (event) => {
    event.preventDefault();
    console.log(Number(balance));

    if (Number(balance) <= Number(EthInputRef.current.value)) return;
    if (!(Number(EthInputRef.current.value) > 0)) return;
    console.log("ok1");

    setIsSwapLoading(true);

    console.log(isTokenSelected);

    let valueIn = EthInputRef.current.value;
    valueIn = ethers.utils.parseEther(valueIn);

    try {
      const res = await executeSwap(
        valueIn,
        defaultToken,
        isTokenSelected.address
      );
      setIsSwapLoading(false);

      EthInputRef.current.value = "";
      buyTokenRef.current.value = "";
      togglePageRefresh(true);
    } catch (e) {
      console.log(e);
    }
    setIsSwapLoading(false);
  };

  console.log(isAllowedLoading);

  return (
    <div className={classes}>
      {selectToken && (
        <SelectTokenModal
          showModal={selectToken}
          selectedToken={SetIsTokenSelected}
          closeModal={SetSelectToken}
          getTokenInfo={fetchTokenHandler}
        />
      )}
      {isSwapLoading && (
        <div className={styles.swapLoading}>
          <div className={styles.loadingWrapper}>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      <form className={styles.swapWrapper}>
        <p>swap</p>
        <div className={styles.inputToken}>
          <label>
            <img src="./images/ethereumlogo.webp" alt="ethereum logo" />
            ETH
          </label>
          <input
            type="text"
            placeholder="0"
            ref={EthInputRef}
            onChange={changeInputHandler}
          />
        </div>
        <div className={styles.inputToken}>
          {!isTokenSelected.name && (
            <button
              onClick={selectTokenHandler}
              type="button"
              className={styles.selectToken}
            >
              Select Token
            </button>
          )}
          {isTokenSelected.name && (
            <button
              onClick={() => SetSelectToken(true)}
              className={styles.selectedToken}
              type="button"
            >
              <img src={isTokenSelected.logoSrc} alt="logo token" />
              <p>{isTokenSelected.name}</p>
            </button>
          )}
          <input type="text" placeholder="0" disabled ref={buyTokenRef} />
        </div>
        {isTokenSelected.name !== null && (
          <div className={styles.fetchingData}>
            {!isLoading && (
              <p>
                1 eth = {tokenPrice.toFixed(2)}{" "}
                <span>{isTokenSelected.name}</span>
              </p>
            )}
            {isLoading && <ImSpinner8 className={styles.loader} />}
          </div>
        )}

        <button type="submit" onClick={swapHanlder} className={styles.swapBtn}>
          {priseInpactError && (
            <p className={styles.error}>Hight price inpact</p>
          )}
          {isAllowedLoading && <ImSpinner8 className={styles.loader} />}
          {error && <p className={styles.error}>insuffient Balance</p>}
          {!error && !priseInpactError && !isAllowedLoading && <p>SWAP</p>}
        </button>
      </form>
      <div className={styles.contributor}>
        <img src="./images/uniswapLogo.png" alt="uniswap logo" />
        <p>Powered by Uniswap V3</p>
      </div>
    </div>
  );
}

export default Swap;
