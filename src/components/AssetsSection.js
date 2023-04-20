import React, { useState } from "react";
import styles from "../styles/sass/layout/assets.module.scss";
import { useAccountCtx } from "../stores/accountProvider";

function AssetsSection() {
  const { TokenDetials } = useAccountCtx();

  return (
    <React.Fragment>
      <div className={styles.assets}>
        <ul className={styles.listTokens}>
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
