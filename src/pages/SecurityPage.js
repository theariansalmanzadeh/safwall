import React, { useRef, useState } from "react";
import ErrorMessage from "../components/ErrorMessage.js";
import InputPhrases from "../components/InputPhrases";
import { BsSearch } from "react-icons/bs";
import styles from "../styles/sass/pages/SecurityPage.module.scss";
import { backgroundMode, createUserData, detectMob } from "../utils/helper";
import { useWeb3Ctx } from "../components/Web3Provider";
import { useNavigate } from "react-router-dom";

function SecurityPage() {
  const {
    lightMode,
    getWalletCreated,
    setUserWallet,
    setWallet,
    getWalletInstance,
  } = useWeb3Ctx();
  const [error, setError] = useState(false);
  const [keyPass, setkeyPass] = useState(false);
  const [loading, setloading] = useState("");
  const [isOrderCorrect, corre] = useState([]);

  const navigate = useNavigate();

  const inputRef = useRef();
  const passRef = useRef();

  const classes = backgroundMode(
    styles.securityPage,
    styles.securityPageDark,
    lightMode
  );

  const securityCheckHandler = async (status) => {
    // event.preventDefault();

    const walletCreated = getWalletCreated();

    if (!status) return;

    setloading("userAccount");
    setError(false);


    if (status) {
      setError(false);
      const res = await createUserData(
        walletCreated.address,
        walletCreated.mnemonics
      );
      if (!res?.objectId) {
        setloading("");
        return;
      }
      const wallet = getWalletInstance();
      setUserWallet(wallet);
    } else {
      setError(true);
    }

    if (detectMob()) {
      setloading("");
      setkeyPass(false);
      navigate("/signup");
    }

    setloading("");
    setkeyPass(true);
  };

  const passwordHandler = async (e) => {
    e.preventDefault();

    setloading("keyStore");

    const wallet = getWalletInstance();

    let walletKeystore = await wallet.encrypt(passRef.current.value);
    setloading("");
    const file = [walletKeystore];
    let blob1 = new Blob(file, { type: "text/plain;charset=utf-8" });

    const url = window.URL || window.webkitURL;
    const link = url.createObjectURL(blob1);
    const a = document.createElement("a");
    a.download = "safwall.txt";
    a.href = link;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log(walletKeystore);

    setWallet({ wallet, walletKeystore });

    localStorage.setItem("walletAddress", walletKeystore);
    console.log(wallet.address);

    navigate("/signup");
  };

  return (
    <div className={classes}>
      <h3>write your key in order in the places</h3>
      <InputPhrases
        securityCheck={securityCheckHandler}
        getPhrases={getWalletCreated}
      />
      {keyPass && (
        <div>
          <form className={styles.password} onSubmit={passwordHandler}>
            <input placeholder="set password" ref={passRef} type="text" />
            <button type="submit">Set Password</button>
          </form>
          <div className={styles.passwordDetails}>
            <BsSearch className={styles.icon} />
            this password is for your json. file you could recover your wallet
            with this password
          </div>
        </div>
      )}
      {error && <ErrorMessage error={error} />}
      {loading !== "" && (
        <div className={styles.loading}>
          <svg
            width="100.000000pt"
            height="100.000000pt"
            viewBox="0 0 512.000000 512.000000"
          >
            <g
              transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
              fill="transparent"
              stroke="#0353a4"
              strokeWidth="50"
              strokeOpacity="1"
            >
              <path
                strokeDasharray={11000}
                strokeDashoffset={11000}
                className={styles.logo}
                d="M2495 4261 c-22 -11 -83 -52 -135 -91 -173 -127 -402 -225 -635 -270
-95 -18 -242 -31 -477 -43 -61 -3 -71 -6 -103 -37 -19 -19 -39 -50 -45 -69 -6
-22 -6 -152 0 -355 36 -1208 135 -1649 437 -1937 99 -94 163 -136 448 -294
127 -70 292 -168 367 -217 75 -49 153 -94 172 -99 50 -14 92 0 168 54 101 71
260 167 453 272 212 115 316 181 406 257 321 273 438 783 464 2023 6 269 5
293 -12 325 -36 68 -60 76 -257 84 -462 18 -739 114 -1091 376 -53 39 -108 46
-160 21z m215 -438 c178 -107 404 -189 635 -232 98 -18 284 -41 336 -41 18 0
19 -9 19 -142 0 -79 -5 -231 -10 -338 -47 -931 -141 -1260 -414 -1455 -34 -24
-149 -91 -256 -150 -180 -99 -362 -206 -434 -254 -29 -19 -30 -19 -55 -2 -56
40 -225 139 -405 238 -309 170 -382 224 -460 342 -148 221 -215 618 -247 1444
-6 169 -10 309 -8 311 2 2 63 9 134 15 341 31 672 139 925 305 l85 55 30 -20
c16 -11 73 -45 125 -76z"
              />
            </g>
          </svg>
          {loading === "userAccount" && <p>Backup your keywords</p>}
          {loading === "keyStore" && <p>making your keystore</p>}
        </div>
      )}
    </div>
  );
}

export default SecurityPage;
