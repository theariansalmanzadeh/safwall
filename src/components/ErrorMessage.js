import React, { useEffect, useState } from "react";
import styles from "../styles/sass/components/Error.module.scss";

function ErrorMessage({ error }) {
  const [classes, setClasses] = useState(error);
  // const [display, setDisplay] = useState(null);

  useEffect(() => {
    // setDisplay(display);
    console.log(classes);
    if (classes === false) return;
    setTimeout(() => {
      setClasses(false);
      console.log(classes);
    }, 5000);
  }, [classes]);

  const display = classes
    ? `${styles.errorMessage} ${styles.active}`
    : `${styles.errorMessage}`;

  return (
    <div className={display}>Error wrong Keys (order might be incorecct)</div>
  );
}

export default ErrorMessage;
