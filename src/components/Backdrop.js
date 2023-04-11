import React from "react";
import styles from "../styles/sass/layout/backDrop.module.scss";

function Backdrop({ onClose }) {
  return <div className={styles.Backdrop} onClick={onClose}></div>;
}

export default Backdrop;
