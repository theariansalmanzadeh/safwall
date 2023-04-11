import React from "react";
import styles from "../styles/sass/layout/selectToken.module.scss";
import { tokenSwap } from "../utils/variables";

function SelectTokenModal({
  showModal,
  selectedToken,
  closeModal,
  getTokenInfo,
}) {
  const classes = showModal
    ? `${styles.selectTokenSection} ${styles.active}`
    : `${styles.selectTokenSection} ${styles.deactive}`;

  const selectTokenHandler = (e) => {
    const target = e.target.closest("li");
    if (!target.classList.contains("token")) {
      return;
    }
    console.log(target.childNodes[0]);

    const address = target.getAttribute("data-address");

    const token = {
      name: target.childNodes[1].innerHTML,
      logoSrc: target.childNodes[0].getAttribute("src"),
      address: address,
    };
    selectedToken(token);

    getTokenInfo(address);
    closeModal(false);
  };

  return (
    <div className={classes}>
      <div className={styles.heading}>
        <p>Select Token</p>
        <button onClick={() => closeModal(false)}>&times;</button>
      </div>
      <ul onClick={selectTokenHandler}>
        {tokenSwap.map((token, ind) => (
          <li key={ind} className="token" data-address={token.contractAddress}>
            <img src={token.imgSrc} alt="token logo" />
            <p>{token.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SelectTokenModal;
