import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import styles from "./styles/sass/components/loader.module.scss";
import Navbar from "./components/Navbar.js";
import Web3Provider from "./components/Web3Provider.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const LoginPage = React.lazy(() => import("./pages/LoginPage.js"));
const HowToUse = React.lazy(() => import("./pages/HowToUse.js"));
const SingupPage = React.lazy(() => import("./pages/SingupPage.js"));
const WalletPreviewPage = React.lazy(() =>
  import("./pages/WalletPreviewPage.js")
);
const SecurityPage = React.lazy(() => import("./pages/SecurityPage"));
const CreatePage = React.lazy(() => import("./pages/CreatePage.js"));
const ImportWalletPage = React.lazy(() =>
  import("./pages/ImportWalletPage.js")
);
const WalletPage = React.lazy(() => import("./pages/Wallet.js"));
const HomePage = React.lazy(() => import("./pages/Home.js"));

const loader = () => {
  <div>
    <ImSpinner3 className={styles.loader} />;
  </div>;
};

function App() {
  return (
    <React.Fragment>
      <Router>
        <Web3Provider className="Web3Provider">
          <Navbar />
          <Suspense fallback={loader}>
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/createwallet" element={<CreatePage />} />
              <Route path="/howtouse" element={<HowToUse />} />
              <Route path="/securitycheck" element={<SecurityPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/importwallet" element={<ImportWalletPage />} />
              <Route path="/walletPreview" element={<WalletPreviewPage />} />
              <Route path="/signup" element={<SingupPage />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </Suspense>
        </Web3Provider>
      </Router>
    </React.Fragment>
  );
}

export default App;
