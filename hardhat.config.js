/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-etherscan");
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
        "fda44b2dcb982f2d04ca002688bd23617dc3235c872b96f5d07d4ee70c5912c5",
      ],
    },
  },
  etherscan: {
    apiKey: "65HPY3B4FJ7KUQRUK3U8Z5Y9B41ESG41XJ",
  },
};
