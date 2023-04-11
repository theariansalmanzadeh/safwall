import artifacts from "../artifacts-ABI/safWall.json";
import React, { useEffect, useState, useContext, createContext } from "react";

import { ethers } from "ethers";
import { userAvailabe, getEncryptedWallet } from "../utils/helper";
import { contractAddress } from "../utils/variables";

const Web3Context = createContext({
  HandlerLightMode: (val) => {},
});

function Web3Provider(props) {
  const [lightMode, setLightMode] = useState("light");
  const [walletCreated, setWalletCreated] = useState(null);
  const [walltInstance, setWalltInstance] = useState(null);
  const [availableWallet, setAvailableWallet] = useState(null);
  const [userWallet, setUserWallet] = useState(null);
  const [provider, setProvider] = useState(null);
  const [userObjectId, setUserObjectId] = useState("");
  const [providerContract, setProviderContract] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  const [mainContracts, setMainContracts] = useState(null);
  const [logInPass, setLogInPass] = useState(null);

  const HandlerLightMode = (val) => {
    val ? setLightMode("light") : setLightMode("dark");
  };

  const walletCreatedHandler = (wallet, walletInstance) => {
    setWalletCreated(wallet);
    setWalltInstance(walletInstance);
  };

  const getNetWorkId = async (prov) => {
    const network = await prov.getNetwork();
    console.log(network); // 42
  };

  const getWalletCreated = () => {
    return walletCreated;
  };

  const getWalletInstance = () => {
    return walltInstance;
  };

  const setWallet = (wallet) => {
    setAvailableWallet(wallet);
  };
  const connectWalletProvider = () => {
    setUserWallet(userWallet.connect(provider));
  };

  const authenticate = () => {
    setIsAuth(true);
  };

  const getAccount = async (password) => {
    const userAddress = getEncryptedWallet();
    try {
      const account = await ethers.Wallet.fromEncryptedJson(
        userAddress,
        password
      );

      setWallet({ wallet: account, walletKeystore: userAddress });
      authenticate();
      return account;
    } catch (e) {
      return null;
    }
  };

  const loadContract = async (provider) => {
    const contract = new ethers.Contract(
      contractAddress,
      artifacts.abi,
      provider
    );
    setMainContracts(contract);
    console.log("interface", contract.interface);
    const name = contract.interface.encodeFunctionData("name", []);
    console.log(name);
  };

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://goerli.infura.io/v3/3a252697a2194109b8fa47e46e439ac0"
    );

    console.log(provider);

    setProvider(provider);
    setProviderContract(provider);
    loadContract(provider);
  }, []);

  // useEffect(() => {
  //   if (!provider) return;
  //   if (userAvailabe() && !availableWallet) {
  //     const userAddress = getEncryptedWallet();
  //     setAvailableWallet(userAddress);
  //   } else if (availableWallet) {
  //     if (!availableWallet.wallet) return;

  //     setUserWallet(availableWallet.wallet);
  //   }
  // }, [provider, availableWallet]);

  // useEffect(() => {
  //   if (!provider || !availableWallet || !userWallet) return;
  //   if (!availableWallet.wallet) return;
  //   if (userWallet.provider) return;
  //   const res = userWallet.connect(provider);
  //   setUserWallet(res);
  //   console.log(res);
  // }, [userWallet, availableWallet, provider]);

  const store = {
    lightMode,
    HandlerLightMode,
    walletCreatedHandler,
    connectWalletProvider,
    getWalletCreated,
    getWalletInstance,
    setWallet,
    getAccount,
    authenticate,
    setLogInPass,
    setUserWallet,
    setUserObjectId,
    userObjectId,
    userWallet,
    mainContracts,
    availableWallet,
    providerContract,
    provider,
    logInPass,
    isAuth,
  };

  return (
    <Web3Context.Provider value={store}>{props.children}</Web3Context.Provider>
  );
}

export const useWeb3Ctx = () => {
  return useContext(Web3Context);
};

export default Web3Provider;
