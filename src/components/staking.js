import React, { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import styles from "../styles/sass/pages/staking.module.scss";
import StakingActivities from "./StakingActivities.js";
import { useAccountCtx } from "../stores/accountProvider";
import { useWeb3Ctx } from "./Web3Provider";
import { backgroundMode } from "../utils/helper";

function Staking() {
  const {} = useAccountCtx();
  const { lightMode, userWallet, provider, providerContract, mainContracts } =
    useWeb3Ctx();

  const [isStaking, setIsStaking] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const [stakingDetial, setStakingDetial] = useState({
    timeStaked: "",
    TimeStakedEnd: "",
    stakedAmount: "",
    user: "",
  });
  const [signerContract, setSignerContract] = useState(null);

  const amountRef = useRef();
  const timeRef = useRef();

  const classes = backgroundMode(styles.stakingSection, styles.dark, lightMode);

  const stskingHandler = async (e) => {
    e.preventDefault();
    setIsloading(true);

    const amount = amountRef.current.value;
    const time = timeRef.current.value;

    // const balance = await provider.blanceOf(userWallet.address);

    console.log("ok");
    if (amount < 1 || time < 7) return;
    // if (amount >= ethers.utils.formatEther(balance)) return;
    // console.log(contractSigner, mainContracts);
    try {
      const amountWei = ethers.utils.parseEther(
        Number(amount).toFixed(3).toString()
      );

      const res = await signerContract.stakingETH(parseInt(time) * 24 * 3600, {
        value: amountWei,
      });
      res.wait();
      console.log(res);
      const resStake = await signerContract.getUserStakedDetails({
        from: userWallet.address,
      });
      console.log(resStake);
    } catch (e) {
      console.log(e);
    }
    setIsloading(false);
  };

  useEffect(() => {
    (async () => {
      setIsloading(true);
      try {
        console.log(providerContract);
        const signerContract = mainContracts.connect(userWallet);
        setSignerContract(signerContract);
        const res = await signerContract.getUserStakedDetails({
          from: userWallet.address,
        });
        setStakingDetial(res);
        console.log(res);

        setIsStaking(true);
      } catch (e) {
        console.log(e);
        setIsStaking(false);
      }
      setIsloading(false);
    })();
  }, []);

  return (
    <div className={classes}>
      <div>
        <h2>Stakes</h2>
        <p>stake your ethers and reward native Tokens of safwall</p>
        <p>circumstances for staking:</p>
        <ul>
          <li>staking amount must be more than 1 ether</li>
          <li>duration must be more than 7 days</li>
          <li>unstaking the funds are upon user</li>
        </ul>
        <form className={styles.stkaingForm}>
          <div>
            <label>
              <span>Amount</span>
            </label>
            <input type="text" placeholder="2.3 ETH" ref={amountRef} />
          </div>
          <div>
            <label>
              <span>Period </span>(in days)
            </label>
            <input type="text" placeholder="3" ref={timeRef} />
          </div>
          <button onClick={stskingHandler}>Stake</button>
        </form>
      </div>
      <StakingActivities
        isStaking={isStaking}
        stakingDetial={stakingDetial}
        isLoading={isLoading}
      />
    </div>
  );
}

export default Staking;
