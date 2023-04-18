import React from "react";
import styles from "../styles/sass/pages/howToUse.module.scss";
import { useWeb3Ctx } from "../components/Web3Provider";
import { backgroundMode } from "../utils/helper";

function HowToUse() {
  const { lightMode } = useWeb3Ctx();

  const classes = backgroundMode(styles.howToPage, styles.dark, lightMode);
  return (
    <div className={classes}>
      <h3>How to create wallet</h3>
      <ol>
        <li>
          first click on the create wallet button(if you allready have skip)
        </li>
        <li>
          then get your seed words and write them on the next page in the order
          as given
        </li>
        <li>
          next you should choose a password for your keyStore file with this
          file and password you can recover your wallet in case you lost your
          seeds
        </li>
        <li>
          after that choose a pasword for the wallet to work with your done
        </li>
      </ol>
      <h4>Additional infos</h4>
      <p>
        the wallet has a build in smart contact for staking and getting rewarded
        with the wallet's token(SFTK) you can find the contract infonrmation and
        details at{" "}
        <span className={styles.contractAddress}>
          0x47b2F525C880dD8227C63FFDc1bF2CF61d2C8921
        </span>
      </p>
      <p className={styles.additionalInfo}>
        Additionally the wallet has a build in swap powered by{" "}
        <span>Uniswap V3</span> and some of the tokens supported on the{" "}
        <span>goerli </span>
        network are available
      </p>
    </div>
  );
}

export default HowToUse;
