import React, { useState } from "react";
import styles from "../styles/sass/layout/assets.module.scss";
import { useAccountCtx } from "../stores/accountProvider";

function AssetsSection() {
  const { TokenDetials } = useAccountCtx();
  const [showAssests, setShowAssests] = useState(false);

  const AssestHandler = () => {
    setShowAssests((prev) => {
      return !prev;
    });
  };

  const classes = showAssests
    ? `${styles.listTokens} ${styles.show}`
    : `${styles.listTokens}`;

  return (
    <React.Fragment>
      <button className={styles.showBtn} onClick={AssestHandler}>
        Assests
      </button>
      <div className={styles.assets}>
        <ul className={classes}>
          <li key={0}>
            <span>symbol</span>
            <span>address</span>
            <span>assets</span>
          </li>
          {TokenDetials.map((token, indx) => (
            <li key={indx + 1}>
              <span>{token.tokenSybmol}</span>
              <span>{token.address}</span>
              <span>{parseFloat(token.balance).toFixed(3)}</span>
            </li>
          ))}
        </ul>
      </div>
    </React.Fragment>
  );
}

export default AssetsSection;
