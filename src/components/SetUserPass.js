import React, { useRef, useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { useWeb3Ctx } from "../components/Web3Provider";
import { createUserPassword, backgroundMode } from "../utils/helper";
import styles from "../styles/sass/pages/signUp.module.scss";

import { AiOutlineLoading } from "react-icons/ai";

function SetUserPass() {
  const {
    lightMode,
    authenticate,
    providerContract,
    setLogInPass,
    mainContracts,
    userWallet,
  } = useWeb3Ctx();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const passRef = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();

    const password = passRef.current.value;

    if (!password) {
      setError(true);
      return;
    }
    setError(false);
    setLoading(true);

    const wallet = userWallet.address;
    const pass = password;

    try {
      const res = await createUserPassword(wallet, pass);
      console.log(res);
      if (!res.objectId) {
        return;
      }
      setLogInPass(pass);

      localStorage.setItem("safWallAddress", userWallet.address);
      authenticate();
      navigate("/walletPreview");
    } catch (e) {
      setError(false);
      setLoading(false);
    }
  };

  const classes = backgroundMode(styles.signUp, styles.Dark, lightMode);
  const inputClasses = error
    ? `${styles.input} ${styles.error}`
    : `${styles.input}`;

  return (
    <div className={classes}>
      <form onSubmit={submitHandler}>
        <input type="text" placeholder="address" value={userWallet.address} />

        <label htmlFor="password">Set a login password</label>
        <input
          type="text"
          ref={passRef}
          name="password"
          className={inputClasses}
          placeholder="password"
        />
        <button type="submit">countinue</button>
      </form>
      {loading && <AiOutlineLoading className={styles.loading} />}
    </div>
  );
}

export default SetUserPass;
