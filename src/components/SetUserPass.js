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
    const res = await createUserPassword(wallet, pass);
    console.log(res);
    if (!res.objectId) {
      return;
    }
    setLogInPass(pass);
    const walletCreator = new ethers.Wallet(
      "0x12ba658b8d2308e6aa03e620f4fda1d4528c07dff131978cd42518ab4994b5eb",
      providerContract
    );
    localStorage.setItem("safWallAddress", userWallet.address);
    const signerContract = mainContracts.connect(walletCreator);
    console.log(signerContract);
    const resContract = await signerContract.makeEligible(userWallet.address);
    console.log(resContract);
    authenticate();
    navigate("/walletPreview");
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
      {loading && <AiOutlineLoading />}
    </div>
  );
}

export default SetUserPass;
