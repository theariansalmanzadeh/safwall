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

  const showTxHistory = () => {
    if (!TxHistory) return <FaSpinner className={styles.loadingActivities} />;
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
      setLoading(true);
      await getBalanceAccount(provider, userWallet);
      await getNonceAccount(provider, userWallet);
      await getEthPrice();
      await getTxHistory(userWallet.address);
      connectWalletProvider();
      console.log("okok");
      const contractSigner = mainContracts.connect(userWallet);
      setStakingContract(contractSigner);
      console.log(userWallet);
      fetchFavoriteTokens(userWallet.connect(provider), userObjectId);
      setLoading(false);
      togglePageRefresh(false);
    })();
  }, [userWallet, provider, updatePage]);

  useEffect(() => {
    if (!balance) return;
    const amount = EthPrice * balance;

    setEthMoney(amount.toFixed(2));
  }, [EthPrice, balance]);

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
          <p>
            Address : {userWallet.address.slice(0, 5)}...
            {userWallet.address.slice(-4)}
          </p>
          <p>Tx number : {loading ? "-" : `${nonce}`}</p>
          <div className={styles.links}>
            <button
              className={styles.AddToken}
              onClick={() => toggleContractModal(true)}
            >
              import Token
            </button>
            <a
              href={`https://goerli.etherscan.io/address/${userWallet.address}`}
              target="_blank"
              rel="noreferrer"
            >
              view Account on etherscan
            </a>
          </div>
          <AssetsSection />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Mywallet;
