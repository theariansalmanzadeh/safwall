import React, { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { Link, useNavigate } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import styles from "../styles/sass/pages/login.module.scss";
import { backgroundMode, logIn, getUserWalletInfo } from "../utils/helper";
import { useWeb3Ctx } from "../components/Web3Provider";

function LoginPage() {
  const { lightMode, setUserWallet, authenticate, setUserObjectId } =
    useWeb3Ctx();

  const classes = backgroundMode(styles.logInSection, styles.dark, lightMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const inputRef = useRef();
  const addressRef = useRef();

  const naivgate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const password = inputRef.current.value;
    const walletAddress = addressRef.current.value;

    if (password.lenght === 0) return;

    setLoading(true);
    try {
      const wallet = await logIn(walletAddress, password);
      if (wallet === null) {
        setError(true);
        setLoading(false);
        return;
      }

      const walletData = await getUserWalletInfo(walletAddress);
      setUserObjectId(walletData.objectId);
      console.log(wallet, walletData);
      setLoading(false);

      if (wallet === null || walletData === null) {
        setError(true);
      } else {
        const wallet = ethers.Wallet.fromMnemonic(walletData.wallet.mnemonics);
        setUserWallet(wallet);
        setLoading(false);
        authenticate();
        naivgate("/wallet");
      }
    } catch (e) {
      console.log("ok");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("safWallAddress")) {
      return;
    }
    console.log(localStorage.getItem("safWallAddress"));
    addressRef.current.value = localStorage.getItem("safWallAddress");
  }, []);

  return (
    <div className={classes}>
      <Link className={styles.importwallet} to="/importwallet">
        import wallet with phrases?
      </Link>
      <form onSubmit={submitHandler} className={styles.formSection}>
        <input type="text" ref={addressRef} placeholder="Address" />
        <input
          placeholder="Password"
          onFocus={() => {
            setError(false);
          }}
          type="text"
          ref={inputRef}
        />
        <button type="submit">unlock</button>
      </form>
      {error && <div className={styles.error}>Error try again</div>}
      <div className={styles.loadWrapper}>
        {loading && <ImSpinner3 className={styles.loader} />}
      </div>
    </div>
  );
}

export default LoginPage;
