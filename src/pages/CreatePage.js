import React, { useEffect, useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { ethers } from "ethers";
import styles from "../styles/sass/layout/phraseBox.module.scss";
import { useWeb3Ctx } from "../components/Web3Provider";
import { backgroundMode } from "../utils/helper";

import { useNavigate, useLocation } from "react-router-dom";

function CreatePage() {
  const [showPhrase, setShowPhrase] = useState(false);

  const { state } = useLocation();

  const [mnemonics, setMnemonics] = useState([]);
  const [newWallet, setNewWallet] = useState({});

  const { walletCreatedHandler, lightMode, getWalletCreated } = useWeb3Ctx();

  let wallet;

  const navigate = useNavigate();

  const phaseHandler = () => {
    if (state === "retrieve Pass") {
      navigate("/securitycheck");
      return;
    }
    const walletdetails = {
      address: newWallet.address,
      mnemonics: newWallet.mnemonic.phrase,
      privateKey: newWallet.privateKey,
      publicKey: newWallet.publicKey,
    };
    walletCreatedHandler(walletdetails, newWallet);
    navigate("/securitycheck");
  };

  const classes = backgroundMode(
    styles.createPage,
    styles.createPageDark,
    lightMode
  );

  useEffect(() => {
    if (state === "retrieve Pass") {
      const walletcreated = getWalletCreated();
      const walletMnemonics = walletcreated.mnemonics;
      console.log(walletMnemonics);
      setMnemonics(walletMnemonics.split(" "));
      return;
    }
    wallet = ethers.Wallet.createRandom();

    console.log(wallet);
    const mnemonics = wallet.mnemonic.phrase;

    setNewWallet(wallet);
    setMnemonics(mnemonics.split(" "));
  }, []);

  return (
    <div className={classes}>
      <h3>your private Key</h3>
      <div className={styles.container}>
        <div className={styles.phraseBox}>
          <ul>
            {mnemonics.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {!showPhrase && (
            <div className={styles.overlay}>
              <button
                onClick={() => {
                  setShowPhrase(true);
                }}
              >
                show phrase
              </button>
            </div>
          )}
        </div>
        <div className={styles.cautionsBox}>
          <div>
            <IoWarningOutline /> your Private Key you should never lose this.
            there is no recovery of this key. we suggest you write your phrases
            on paper and keep it in a safe place
          </div>
          <button onClick={phaseHandler} className={styles.submitBtn}>
            Got it{" "}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
