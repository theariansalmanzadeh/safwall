import React from "react";
import { Navigate } from "react-router-dom";
import AccountWallet from "../components/AccountsWallet.js";
import LoginPage from "./LoginPage.js";
import { useWeb3Ctx } from "../components/Web3Provider.js";
import AccountProvider from "../stores/accountProvider";

function WalletPage() {
  const { isAuth } = useWeb3Ctx();
  console.log(isAuth);
  if (!isAuth) {
    console.log("22");
    return <Navigate to="/login" />;
  }
  return (
    <AccountProvider>
      <AccountWallet />
    </AccountProvider>
  );
}

export default WalletPage;
