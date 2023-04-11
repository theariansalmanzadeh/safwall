import React, { createContext, useContext, useState } from "react";
import { ethers } from "ethers";
import { abi } from "../utils/variables";
import { getBalace, getNonce, findAPI } from "../utils/helper";

const AccountContext = createContext({});

function AccountProvider({ children }) {
  const [balance, setBalance] = useState(0);
  const [nonce, setNonce] = useState(0);
  const [TxHistory, setTxHistory] = useState(null);
  const [EthPrice, setEthPrice] = useState(null);
  const [addContracts, setAddContracs] = useState(false);
  const [updatePage, setUpdatePage] = useState(true);
  const [TokenDetials, setTokenDetials] = useState([]);
  const [stakingContract, setStakingContract] = useState(null);
  const [contracts, setContracts] = useState([]);

  const getBalanceAccount = async (provider, wallet) => {
    const res = await getBalace(provider, wallet);
    setBalance(res);
  };
  const getNonceAccount = async (provider, wallet) => {
    const res = await getNonce(provider, wallet);
    setNonce(res);
  };
  const getTxHistory = async (address) => {
    const apiKey = "65HPY3B4FJ7KUQRUK3U8Z5Y9B41ESG41XJ";
    const url = `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${apiKey}`;
    const res = await fetch(url);
    const Txhis = await res.json();

    setTxHistory(Txhis);
  };

  const togglePageRefresh = (state) => {
    console.log(state);
    setUpdatePage(state);
    console.log(updatePage);
  };

  const getEthPrice = async () => {
    const url =
      "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1";
    const res = await fetch(url);
    if (!res.ok) return;
    const EthPrice = await res.json();

    setEthPrice(EthPrice.prices.at(-1)[1]);
  };

  const fetchFavoriteTokens = async (wallet, userId) => {
    const data = await findAPI(wallet.address, userId);

    setTokenDetials([]);
    if (data?.token) {
      data.tokens.map((token) =>
        addContractAddress(token.address, token.symbol, wallet)
      );
    }
  };

  const toggleContractModal = (state) => {
    setAddContracs(state);
  };

  const addContractAddress = async (address, tokenSybmol, wallet) => {
    const contract = await connectContact(address, wallet);
    const Bigbalance = await getBalanceToken(contract, wallet.address);
    const decimals = await contract.decimals();
    let balance = Number(Bigbalance);
    balance = ethers.utils.formatUnits(balance.toString(), decimals);

    const token = { address, tokenSybmol, contract, balance };

    setTokenDetials((prev) => [...prev, token]);
  };

  const connectContact = async (address, wallet) => {
    const contract = new ethers.Contract(address, abi, wallet);

    setContracts(contract);
    return contract;
  };

  const getBalanceToken = async (contract, walletAddress) => {
    const balance = await contract.balanceOf(walletAddress);
    return balance;
  };

  const storeAccount = {
    getBalanceAccount,
    toggleContractModal,
    addContractAddress,
    getNonceAccount,
    getTxHistory,
    getEthPrice,
    connectContact,
    setStakingContract,
    fetchFavoriteTokens,
    togglePageRefresh,
    stakingContract,
    EthPrice,
    balance,
    nonce,
    TxHistory,
    contracts,
    addContracts,
    TokenDetials,
    updatePage,
  };

  return (
    <AccountContext.Provider value={storeAccount}>
      {children}
    </AccountContext.Provider>
  );
}

export default AccountProvider;

export const useAccountCtx = () => {
  return useContext(AccountContext);
};
