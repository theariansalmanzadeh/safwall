import { ethers } from "ethers";
import Parse, { initialize } from "parse";
import { json } from "react-router-dom";

export const backgroundMode = (defau, styleDark, mode) => {
  return mode === "dark" ? `${defau} ${styleDark}` : `${defau}`;
};

export const storeData = (address, password) => {
  const url =
    "https://saf-wal-default-rtdb.europe-west1.firebasedatabase.app/user.json";
  const res = fetch(`${url}`, {
    method: "POST",
    body: JSON.stringify({ address: address, password: password }),
    headers: { "Content-Type": "application/json" },
  });
  return res;
};

export const userAvailabe = () => {
  return localStorage.getItem("walletAddress") ? true : false;
};

export const getEncryptedWallet = () => {
  return localStorage.getItem("walletAddress");
};

export const getAddress = async (wallet) => {
  const addr = await wallet.getAddress();
  return addr;
};

export const getBalace = async (provider, wallet) => {
  const adderss = await getAddress(wallet);
  const balace = await provider.getBalance(adderss);
  return Number(ethers.utils.formatEther(balace)).toFixed(3);
};

export const getNonce = async (provider, wallet) => {
  const adderss = await getAddress(wallet);
  const nonce = await provider.getTransactionCount(adderss);
  return nonce;
};

////////////////////////////////////////////
//user account

export const initializeServer = async () => {
  Parse.serverURL = "https://parseapi.back4app.com"; // This is your Server URL
  // Remember to inform BOTH the Back4App Application ID AND the JavaScript KEY
  Parse.initialize(
    "KgV7DeWpEWllp2kbK4bSn1D6YNMsoZ2AdlIidTJR", // This is your Application ID
    "6RhpSb7T68jtwtXTfH9CKrdCTEyjXLW1xJHMbfAk", // This is your Javascript key
    "6WyDZ3mPV8TWQmH0CwWgkqJa28EyMJZDf2T4iHxY"
  );
};

export const createUserPassword2 = async () => {
  const user = new Parse.User();
  user.set("username", "A string");
  user.set("password", "#Password123");

  try {
    let userResult = await user.signUp();
    console.log(userResult);
  } catch (error) {
    console.log(error);
  }
};

export const createUserPassword = async (wallet, password) => {
  try {
    const res = await fetch("https://parseapi.back4app.com/users", {
      method: "POST",
      headers: {
        "X-Parse-Application-Id": "KgV7DeWpEWllp2kbK4bSn1D6YNMsoZ2AdlIidTJR",
        "X-Parse-REST-API-Key": "6WyDZ3mPV8TWQmH0CwWgkqJa28EyMJZDf2T4iHxY",
        "X-Parse-Revocable-Session": "1",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: wallet, password: password }),
    });
    const data = await res.json();
    return data;
  } catch (e) {
    alert("oops! try again");
  }
};

export const logIn = async (userName, password) => {
  initializeServer();
  try {
    let user = await Parse.User.logIn(userName, password);
    console.log(user);
    return user;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const findAPI = async (walletAddress, objectId) => {
  const res = await fetch(
    `https://parseapi.back4app.com/classes/u${walletAddress}/${objectId}`,
    {
      method: "GET",
      headers: {
        "X-Parse-Application-Id": "KgV7DeWpEWllp2kbK4bSn1D6YNMsoZ2AdlIidTJR",
        "X-Parse-REST-API-Key": "6WyDZ3mPV8TWQmH0CwWgkqJa28EyMJZDf2T4iHxY",
      },
    }
  );
  const data = await res.json();
  console.log(data);
  return data;
};

export const createUserData = async (walletAddress, userMnemonics) => {
  console.log(userMnemonics);
  try {
    const res = await fetch(
      `https://parseapi.back4app.com/classes/u${walletAddress}`,
      {
        method: "POST",
        headers: {
          "X-Parse-Application-Id": "KgV7DeWpEWllp2kbK4bSn1D6YNMsoZ2AdlIidTJR",
          "X-Parse-REST-API-Key": "6WyDZ3mPV8TWQmH0CwWgkqJa28EyMJZDf2T4iHxY",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet: { mnemonics: userMnemonics },
        }),
      }
    );
    const result = await res.json();

    return result;
  } catch (e) {
    alert("error please try again");
    return null;
  }
};

export const saveTokenAddress = async (
  walletAddress,
  tokenAddress,
  objectId
) => {
  const wallet = await getUserWalletInfo(walletAddress);

  let totalAddress;

  if (!wallet.tokens) {
    totalAddress = [];
  } else {
    if (wallet.tokens.length > 0) totalAddress = wallet.tokens;
  }

  console.log(wallet);

  const res = await fetch(
    `https://parseapi.back4app.com/classes/u${walletAddress}/${objectId}`,
    {
      method: "PUT",
      headers: {
        "X-Parse-Application-Id": "KgV7DeWpEWllp2kbK4bSn1D6YNMsoZ2AdlIidTJR",
        "X-Parse-REST-API-Key": "6WyDZ3mPV8TWQmH0CwWgkqJa28EyMJZDf2T4iHxY",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokens: [tokenAddress, ...totalAddress],
      }),
    }
  );
};

export const getUserWalletInfo = async (walletAddress) => {
  try {
    const res = await fetch(
      `https://parseapi.back4app.com/classes/u${walletAddress}`,
      {
        method: "GET",
        headers: {
          "X-Parse-Application-Id": "KgV7DeWpEWllp2kbK4bSn1D6YNMsoZ2AdlIidTJR",
          "X-Parse-REST-API-Key": "6WyDZ3mPV8TWQmH0CwWgkqJa28EyMJZDf2T4iHxY",
        },
      }
    );
    const wallet = await res.json();
    console.log(wallet);

    return wallet.results[0];
  } catch (e) {
    return null;
  }
};

export const TxHistoryDisplay = (TxHistory) => {
  if (TxHistory.status === "0") return TxHistory.message;
  if (TxHistory.result.length > 0) return TxHistory.result;
  else return 0;
};

export const checkToRefresh = async (balance, provider, address) => {};
