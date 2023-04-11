import React, { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { useWeb3Ctx } from "./Web3Provider";
import styles from "../styles/sass/layout/modal.module.scss";
import { useAccountCtx } from "../stores/accountProvider.js";

function SendEth({ onClose }) {
  const {
    balance,
    getBalanceAccount,
    getNonceAccount,
    nonce,
    togglePageRefresh,
  } = useAccountCtx();
  const { provider, userWallet } = useWeb3Ctx();

  const [error, setError] = useState(false);
  const [gas, setGas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [txInfo, setTxInfo] = useState(false);
  const [TxHash, setTxHash] = useState("");

  const valueInputRef = useRef();
  const addressInputRef = useRef();

  const sendEthHandler = async (e) => {
    e.preventDefault();

    if (!provider) return;
    if (!addressInputRef.current.value) return;
    if (!valueInputRef.current.value) return;
    if (error) return;

    setSendLoading(true);

    const value = ethers.utils.parseEther(valueInputRef.current.value);

    const maxGas = await provider.getFeeData();
    const estimatedGas = await provider.getGasPrice();

    const tx = {
      to: addressInputRef.current.value,
      value: value,
      nonce: nonce,
      gasLimit: 21000,
      gasPrice: maxGas.maxFeePerGas,
    };
    console.log(addressInputRef.current.value);

    console.log(Number(maxGas.maxFeePerGas), Number(estimatedGas));

    try {
      const txRes = await userWallet.sendTransaction(tx);
      console.log(txRes);
      setTxInfo(true);
      setTxHash(txRes.hash);
      await txRes.wait();
      setSendLoading(false);
      togglePageRefresh(true);
    } catch (e) {
      setSendLoading(false);
    }
  };

  const changeValueHandler = () => {
    const value = valueInputRef.current.value;
    const address = addressInputRef.current.value;
    if (value > balance) {
      setError(true);
      return;
    } else {
      setError(false);
    }
    if (!provider) return;
    if (!address) return;
    (async () => {
      const addressInput = addressInputRef.current.value;
      const value = valueInputRef.current.value;

      setLoading(true);
      setError(false);

      const res = await provider.estimateGas({
        to: addressInput,

        value: ethers.utils.parseEther(value),
        nonce: nonce,
      });
      const gasPrice = await provider.getGasPrice();
      setGas(ethers.utils.formatEther(gasPrice));

      getBalanceAccount(provider, userWallet);
      getNonceAccount(provider, userWallet);

      setLoading(false);
    })();
  };

  return (
    <React.Fragment>
      <div className={styles.sendEth}>
        <div className={styles.closeModal}>
          <button
            onClick={() => {
              onClose();
            }}
          >
            &times;
          </button>
        </div>
        <form>
          <input
            type="text"
            className={styles.sendAddress}
            placeholder="Address"
            ref={addressInputRef}
          />
          <input
            type="text"
            className={styles.sendInput}
            ref={valueInputRef}
            onChange={changeValueHandler}
            placeholder="0.1 Eth"
          />
          <button
            type="button"
            onClick={() => {
              valueInputRef.current.value = balance;
            }}
          >
            Max
          </button>
          {error && <span className={styles.error}>insufficient balance</span>}
          {gas && !error && (
            <span className={styles.gas}>estimated gas Price:{gas}Eth</span>
          )}
          {loading && <span>loading gas</span>}
          <button
            onClick={sendEthHandler}
            type="submit"
            className={styles.sendBtn}
          >
            Send
          </button>
        </form>
        {sendLoading && (
          <div className={styles.loadingWrapper}>
            <ul>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        )}
      </div>
      {txInfo && (
        <div className={styles.txInfoWrapper}>
          <p>
            hash Tx : <span>{TxHash}</span>
          </p>
        </div>
      )}
    </React.Fragment>
  );
}

export default SendEth;
