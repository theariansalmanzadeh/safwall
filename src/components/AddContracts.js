import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/sass/layout/addContract.module.scss";
import { useAccountCtx } from "../stores/accountProvider";
import { useWeb3Ctx } from "../components/Web3Provider";
import { saveTokenAddress } from "../utils/helper";

function AddContracts() {
  const addressRef = useRef();
  const symbolRef = useRef();
  const [error, setError] = useState(false);

  const { toggleContractModal, addContractAddress } = useAccountCtx();
  const { provider, userWallet, userObjectId } = useWeb3Ctx();
  const AddTokenHandler = (e) => {
    e.preventDefault();

    if (!addressRef.current.value && !symbolRef.current.value) {
      setError(true);
      return;
    }
    const address = addressRef.current.value;
    const symbol = symbolRef.current.value;
    addContractAddress(address, symbol, userWallet.connect(provider));
    addressRef.current.value = "";
    symbolRef.current.value = "";

    const token = { address, symbol };
    saveTokenAddress(userWallet.address, token, userObjectId);
  };

  return (
    <div className={styles.AddContract}>
      <div className={styles.closeModal}>
        <button
          onClick={() => {
            toggleContractModal(false);
          }}
        >
          &times;
        </button>
      </div>
      <form onSubmit={AddTokenHandler}>
        <input placeholder="Token Address" type="text" ref={addressRef} />
        <input placeholder="Token Symbol" type="text" ref={symbolRef} />
        <button type="submit">Add Token</button>
      </form>
      <Link to="https://goerli.etherscan.io/" target="_blank">
        find your Tokens on Etherscan
      </Link>
    </div>
  );
}

export default AddContracts;
