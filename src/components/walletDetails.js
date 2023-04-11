import React from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3Ctx } from "./Web3Provider";
import styles from "../styles/sass/pages/Preview.module.scss";

function WalletDetails() {
  const { userWallet, isAuth, logInPass, connectWalletProvider } = useWeb3Ctx();

  const navigate = useNavigate();

  console.log(isAuth);

  if (!userWallet) return;

  return (
    <div className={styles.previewSection}>
      <h3>Your wallet</h3>
      <div>
        <div>
          <p>address :</p>
          <span>{userWallet.address}</span>
        </div>
        <div>
          <p>private key :</p>
          <span>{userWallet.privateKey}</span>
        </div>
        <div>
          <p>logIn password :</p>
          <span>{logInPass}</span>
        </div>
      </div>
      <div className={styles.btnWrapper}>
        <button
          onClick={() => {
            connectWalletProvider();
            navigate("/wallet");
          }}
        >
          countine
        </button>
      </div>
    </div>
  );
}

export default WalletDetails;
