import React from "react";
import ReactDOM from "react-dom";
import Backdrop from "../Backdrop.js";
import AddContracts from "../AddContracts.js";

function AddContractsModal() {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop />,
        document.getElementById("add-contracts")
      )}

      {ReactDOM.createPortal(
        <AddContracts />,
        document.getElementById("add-contracts")
      )}
    </React.Fragment>
  );
}

export default AddContractsModal;
