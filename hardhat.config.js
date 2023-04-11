/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-ethers");
require("ethers");

module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: {
        accountsBalance: "1000000000000000000000",
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
    goerli: {
      url: "https://goerli.infura.io/v3/3a252697a2194109b8fa47e46e439ac0",
      accounts: [
        "12ba658b8d2308e6aa03e620f4fda1d4528c07dff131978cd42518ab4994b5eb",
      ],
    },
  },
};
