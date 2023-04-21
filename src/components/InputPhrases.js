import React, { useRef, useEffect } from "react";
import styles from "../styles/sass/layout/phrasesCheck.module.scss";
import { useNavigate } from "react-router-dom";

let isUsed = [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
];

function InputPhrases({ getPhrases, securityCheck }) {
  const { mnemonics } = getPhrases();

  const wordRef = useRef();
  const boxRef = useRef();

  const navigate = useNavigate();

  const checkOrderHandler = () => {
    const values = boxRef.current.children;
    let keys = [];

    for (let i = 0; i < values.length; i++) {
      keys.push(values[i].textContent);
    }

    const phrases = mnemonics.split(" ");

    const status = keys.every((key, indx) => key === phrases[indx]);

    securityCheck(status);
  };

  const inputSectionHandler = (e) => {
    if (!e.target.classList.contains("phrase")) return;

    const targetElem = e.target;
    targetElem.setAttribute("set-selected", true);

    showInBox(e.target.textContent);
    removeFromInput(targetElem);
  };

  const showInBox = (value) => {
    const newElem = document.createElement("div");

    newElem.className = `${styles.boxPhrase} phrase`;
    newElem.textContent = value;
    const box = document.getElementById("box");

    box.append(newElem);
  };

  const showrandomWods = (words) => {
    let input;
    const target = wordRef.current;

    if (target.innerHTML !== "") target.innerHTML = "";

    for (let i = 0; i < 12; i++) {
      do {
        input = Math.floor(Math.random() * 12);
      } while (isUsed[input] === true);
      isUsed[input] = true;
      const newElem = document.createElement("div");
      newElem.className = `${styles.child} phrase`;
      newElem.textContent = words[input];

      target.append(newElem);
    }
  };

  const removeFromInput = (target) => {
    wordRef.current.removeChild(target);
  };

  const removeFromBoxHandler = (e) => {
    if (!e.target.classList.contains("phrase")) return;

    addToInput(e.target.textContent);

    boxRef.current.removeChild(e.target);
  };

  const addToInput = (textValue) => {
    const newElem = document.createElement("div");
    newElem.className = `${styles.child} phrase`;

    newElem.textContent = textValue;

    wordRef.current.append(newElem);
  };

  useEffect(() => {
    showrandomWods(mnemonics.split(" "));
  }, []);

  console.log(mnemonics);
  return (
    <React.Fragment>
      <div className={styles.wrapper}>
        <div
          onClick={removeFromBoxHandler}
          className={styles.checkBox}
          id="box"
          ref={boxRef}
        ></div>
      </div>
      <div className={styles.wrapper}>
        <div
          onClick={inputSectionHandler}
          ref={wordRef}
          className={styles.showPhrases}
          id="wordsDisplay"
        ></div>
      </div>
      <div className={styles.Btns}>
        <button onClick={checkOrderHandler} className={styles.checkBtn}>
          Submit
        </button>
        {/* <button onClick={() => navigate(-1)}>Back</button> */}
      </div>
    </React.Fragment>
  );
}

export default InputPhrases;
