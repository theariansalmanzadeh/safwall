import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useWeb3Ctx } from "../components/Web3Provider";
import { backgroundMode } from "../utils/helper";
import styles from "../styles/sass/pages/importWallet.module.scss";

function ImportWalletPage() {
  const { lightMode, authenticate, setUserWallet } = useWeb3Ctx();
  const inputRef = useRef();
  const navigate = useNavigate();

  const SubmitHandler = (e) => {
    e.preventDefault();

    const privateKey = inputRef.current.value;

    if (!privateKey) return;

    const wallet = ethers.Wallet.fromMnemonic(privateKey);

    setUserWallet(wallet);

    authenticate();
    navigate("/signup");
  };

  const classes = backgroundMode(
    styles.ImportWalletPage,
    styles.ImportWalletPageDark,
    lightMode
  );

  return (
    <div className={classes}>
      <form onSubmit={SubmitHandler}>
        <label>Set your private key</label>
        <input type="text" ref={inputRef} placeholder="phrase 1 phrase 2 ..." />
        <button type="submit">import</button>
      </form>
    </div>
  );
}

export default ImportWalletPage;
