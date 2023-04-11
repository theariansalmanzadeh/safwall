import React from "react";
import { ethers } from "ethers";
import styles from "../styles/sass/pages/staking.module.scss";
import Placeholder from "react-bootstrap/Placeholder";
import { useWeb3Ctx } from "./Web3Provider.js";

function StakingActivities({ isStaking, isLoading, stakingDetial }) {
  const { lightMode, userWallet, provider, providerContract, mainContracts } =
    useWeb3Ctx();

  const totalTime = () => {
    const timeEnd = Number(stakingDetial.TimestakedEnd);
    const timeStart = Number(stakingDetial.TimeStaked);
    return (timeEnd - timeStart) / (60 * 60 * 24);
  };

  const fomratAmount = () => {
    return ethers.utils.formatEther(stakingDetial.stakedAmount);
  };

  const unStakeHandler = async () => {
    const wallet = userWallet.connect(providerContract);
    await mainContracts.connect(wallet).unstakeETH();
  };

  return (
    <React.Fragment>
      {isStaking && !isLoading && (
        <div className={styles.stakingActivity}>
          <div className={styles.details}>
            <p>Time Period :</p>
            <p>{totalTime()} days</p>
          </div>
          <div className={styles.details}>
            <p>Amount of Stake :</p>
            <p>{fomratAmount()} ETH</p>
          </div>
          <div className={styles.details}>
            <p>Left time :</p>
            <p>{1} days</p>
          </div>
          <button onClick={unStakeHandler}>unStake</button>
        </div>
      )}
      {!isStaking && !isLoading && (
        <div className={styles.stakingActivity}>
          <div className={styles.noFunds}>
            <p>no stakings found</p>
          </div>
        </div>
      )}
      {isLoading && (
        <div className={styles.stakingActivityLoading}>
          <Placeholder
            as="div"
            style={{
              margin: 0,
              height: "100%",
              width: "100%",
              borderRadius: "1rem",
            }}
            animation="wave"
          >
            <Placeholder xs={12} style={{ margin: 0, height: "100%" }} />
          </Placeholder>
        </div>
      )}
    </React.Fragment>
  );
}

export default StakingActivities;
