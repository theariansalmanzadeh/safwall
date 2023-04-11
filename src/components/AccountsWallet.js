import React, { useState } from "react";
import "../styles/sass/components/tabs.scss";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Staking from "./staking.js";
import Mywallet from "./Mywallet";
import Swap from "./Swap";
import { backgroundMode } from "../utils/helper";
import { useWeb3Ctx } from "../components/Web3Provider";

function AccountWallet() {
  const [key, setKey] = useState("home");
  const { lightMode } = useWeb3Ctx();

  const classes = backgroundMode("nav-tabs", "dark", lightMode);

  return (
    <React.Fragment>
      <Tabs
        id="controlled-tab-example"
        fill
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className={classes}
      >
        <Tab eventKey="home" title="Home">
          <Mywallet />
        </Tab>
        <Tab eventKey="profile" title="Staking">
          <Staking />
        </Tab>
        <Tab eventKey="contact" title="Buy Token">
          <Swap />
        </Tab>
      </Tabs>
    </React.Fragment>
  );
}

export default AccountWallet;
