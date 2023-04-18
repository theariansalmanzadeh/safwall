import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { BsSun, BsMoon } from "react-icons/bs";
import styles from "../styles/sass/layout/Navbar.module.scss";
import { useWeb3Ctx } from "./Web3Provider";
import { backgroundMode } from "../utils/helper";
import { RxHamburgerMenu } from "react-icons/rx";

function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const { HandlerLightMode, lightMode } = useWeb3Ctx();
  const [IsshowMenu, setIsshowMenu] = useState(false);

  const classes = backgroundMode(styles.NavBar, styles.NavBarDark, lightMode);

  const lightHandler = () => {
    setIsDark((prev) => {
      return !prev;
    });
    HandlerLightMode(isDark);
  };

  const classesSun = isDark
    ? `${styles.sun} ${styles.Active}`
    : `${styles.sun}`;
  const classesDark = isDark
    ? `${styles.moon} ${styles.Active}`
    : `${styles.moon}`;

  return (
    <div className={classes}>
      <RxHamburgerMenu
        onClick={() => setIsshowMenu(true)}
        className={styles.hamburgerMenu}
      />
      {
        <ul className={IsshowMenu ? ` ${styles.active}` : ``}>
          <button
            onClick={() => {
              setIsshowMenu(false);
            }}
            className={styles.closeBtnMenu}
          >
            &times;
          </button>
          <li>
            <NavLink
              onClick={() => {
                setIsshowMenu(false);
              }}
              to="/home"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={() => {
                setIsshowMenu(false);
              }}
              to="/wallet"
            >
              My Wallet
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={() => {
                setIsshowMenu(false);
              }}
              to="/howtouse"
            >
              How to use
            </NavLink>
          </li>
        </ul>
      }
      <div className={styles.interaction}>
        <div className={styles.light} onClick={lightHandler}>
          <div className={classesSun}>
            <BsSun />
          </div>
          <div className={classesDark}>
            <BsMoon />
          </div>
        </div>

        <svg
          width="50.000000pt"
          height="50.000000pt"
          viewBox="0 0 512.000000 512.000000"
        >
          <g
            transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill={lightMode !== "dark" ? "#061a40" : "#b9d6f2"}
            strokeWidth="50"
            strokeOpacity="1"
          >
            <path
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
      </div>
    </div>
  );
}

export default Navbar;
