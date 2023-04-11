import React from "react";
import ReactDOM from "react-dom";
import Backdrop from "../Backdrop.js";
import SendEth from "../SendEth.js";

function SendModal({ nonce, balance, closeHadler }) {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop onClose={closeHadler} />,
        document.getElementById("send-ETH")
      )}

      {ReactDOM.createPortal(
        <SendEth nonce={nonce} balance={balance} onClose={closeHadler} />,
        document.getElementById("send-ETH")
      )}
    </React.Fragment>
  );
}

export default SendModal;
