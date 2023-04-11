const { expect } = require("chai");
const { ethers } = require("hardhat");
const { compileString } = require("sass");

describe("Token Contract", function () {
  let contract;
  it("depoloyment contract", async function () {
    const Token = await ethers.getContractFactory("safWall");
    const account1 = await ethers.getSigner();
    const balance = await account1.getBalance();

    contract = await Token.deploy("safe wallet", "SATKN");
  });

  it("get name", async function () {
    const name = await contract.name();
    expect(name).equal("safe wallet");
  });
  it("send ETH and check balance", async function () {
    const account1 = await ethers.getSigner();
    const Tx = await account1.sendTransaction({
      to: contract.address,
      value: ethers.utils.parseEther("0.3"),
      gasLimit: 25000,
      gasPrice: ethers.utils.parseUnits("10", "gwei"),
    });

    // console.log(Tx);
  });

  it("make account eligable", async function () {
    const [account1, account2, account3] = await ethers.getSigners();

    const totalSupply = await contract.allTokensMinted();
    // console.log(account2.address);

    await contract.makeEligible(account3.address);
  });

  it("staking ETH and unstaking", async function () {
    const [account1, account2, account3] = await ethers.getSigners();

    // console.log(account2.address);

    await contract
      .connect(account3)
      .stakingETH(10, { value: ethers.utils.parseEther("2") });

    const stakedDetsils = await contract.getTotalUserStaked();
    const balance = await contract.contractBalance();
    const timedRemained = await contract.stakedTimeRemained(account3.address);
    console.log(stakedDetsils);
    console.log(balance);
    console.log("remaid time:", timedRemained);
  });
});
