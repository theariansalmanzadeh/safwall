import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "../styles/sass/pages/wallet.module.scss";
import { backgroundMode } from "../utils/helper";
import { useAccountCtx } from "../stores/accountProvider";
import { useWeb3Ctx } from "./Web3Provider";
import SendModal from "./layout/SendModal";
import AddContractsModal from "./layout/AddContractsModal";
import AssetsSection from "./AssetsSection.js";
import { ethers } from "ethers";
import { AiOutlineCopy } from "react-icons/ai";

let prveBalance;

function Mywallet() {
  const {
    lightMode,
    userWallet,
    provider,
    mainContracts,
    connectWalletProvider,
    userObjectId,
  } = useWeb3Ctx();

  const {
    getBalanceAccount,
    toggleContractModal,
    getEthPrice,
    getNonceAccount,
    setStakingContract,
    getTxHistory,
    EthPrice,
    nonce,
    TxHistory,
    balance,
    addContracts,
    fetchFavoriteTokens,
    updatePage,
    togglePageRefresh,
  } = useAccountCtx();

  const classes = backgroundMode(styles.wallet, styles.walletDark, lightMode);

  const [loading, setLoading] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [EthMoney, setEthMoney] = useState(null);

  const closeModalHadler = () => {
    setIsSend(false);
  };

  const disPlayAddress = (address) => {
    return address.slice(0, 5) + "..." + address.slice(-3);
  };

  console.log(TxHistory);
  const showTxHistory = () => {
    if (!TxHistory) return <FaSpinner className={styles.loadingActivities} />;
    if (TxHistory.status === "-1") return <p>could not get infos</p>;
    if (TxHistory.status === "0") return <p>{TxHistory.message}</p>;
    return TxHistory.result.map((tx) => {
      return (
        <Link to={`https://goerli.etherscan.io/tx/${tx.hash}`} target="_blank">
          <div className={styles.Txinfo}>
            <p>
              <span>Hash:</span>
              {tx.hash}
            </p>
            <p>
              <span>Block:</span>
              {tx.blockNumber}
            </p>
            <p>
              <span>TO:</span>
              {tx.to}
            </p>
            <p>
              <span>from:</span>
              {tx.from}
            </p>
          </div>
        </Link>
      );
    });
  };

  useEffect(() => {
    if (!userWallet) return;
    if (updatePage === false) return;

    (async () => {
      try {
        setLoading(true);
        await getBalanceAccount(provider, userWallet);
        await getNonceAccount(provider, userWallet);
        await fetchFavoriteTokens(userWallet.connect(provider), userObjectId);

        await getEthPrice();
        await getTxHistory(userWallet.address);

        connectWalletProvider();

        const contractSigner = mainContracts.connect(userWallet);

        setStakingContract(contractSigner);

        setLoading(false);
        togglePageRefresh(false);
      } catch (e) {
        setLoading(false);
        togglePageRefresh(false);
      }
    })();
  }, [userWallet, provider, updatePage]);

  prveBalance = balance;

  useEffect(() => {
    if (!balance) return;
    const amount = EthPrice * balance;

    setEthMoney(amount.toFixed(2));
  }, [EthPrice, balance]);

  useEffect(() => {
    const timer = setInterval(async () => {
      let newBalance = await provider.getBalance(userWallet.address);
      newBalance = ethers.utils.formatEther(newBalance);
      newBalance = String(Number(newBalance).toFixed(3));

      togglePageRefresh(newBalance === prveBalance ? false : true);
    }, 1000 * 10);

    return () => {
      clearInterval(timer);
    };
  }, [provider]);

  if (!userWallet) return;

  return (
    <React.Fragment>
      {isSend && (
        <SendModal
          nonce={nonce}
          balance={balance}
          closeHadler={closeModalHadler}
        />
      )}

      {addContracts && <AddContractsModal />}

      <div className={classes}>
        <div className={styles.leftSection}>
          <div className={styles.TxBtn}>
            <button
              onClick={() => {
                setIsSend(true);
              }}
              className={styles.txBtn}
            >
              Send ETH
            </button>
          </div>
          <div className={styles.activities}>
            <p>Activities</p>
            <div className={styles.Txinfo}>{showTxHistory()}</div>
          </div>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.assetWrapper}>
            {loading ? (
              <p className={styles.ethNum}>- ETH</p>
            ) : (
              <p className={styles.ethNum}>{balance} ETH</p>
            )}
            <img
              className={styles.etherLogo}
              src="./images/ethereumlogo.webp"
              alt="ethereum logo"
            />
          </div>

          {loading && <FaSpinner className={styles.loader} />}
          <p>balance : {loading ? "-" : `$${EthMoney}`}</p>
          <div className={styles.addressWrapper}>
            <p>Address : {disPlayAddress(userWallet.address)}</p>
            <button
              onClick={() => navigator.clipboard.writeText(userWallet.address)}
            >
              <AiOutlineCopy />
            </button>
          </div>
          <p>Tx number : {loading ? "-" : `${nonce}`}</p>
          <div className={styles.links}>
            <a
              href={`https://goerli.etherscan.io/address/${userWallet.address}`}
              target="_blank"
              rel="noreferrer"
            >
              view Account on etherscan
            </a>
            <button
              className={styles.showBtn}
              onClick={() => toggleContractModal(true)}
            >
              import Token
            </button>
          </div>
          <AssetsSection />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Mywallet;
