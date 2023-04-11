// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract safWall is ERC20{

  struct stakingDetails{
    address user;
    uint TimeStaked;
    uint TimestakedEnd;
    uint stakedAmount;
  }

  address public owner;
  mapping(address=>bool)public eligibleAddress;
  mapping(address=>uint)public addressToIndex;
  mapping(address=>bool)public addressStakeStatus;
  mapping(address=>uint)private addressToStakingDetails;

  address[]public stakingAddress;
  stakingDetails[]private stakedAddressDetails;
  

  uint stakingInterestRatePercentage = 10;
  uint minimumStakingETH = 1 ether;
  uint minimumStakingTime = 7 days;


  modifier onlyOwner(){
    require(msg.sender == owner,"only owner is allowed");
    _;
  }

  constructor(string memory name,string memory symbol) ERC20(name,symbol){
    
    owner = msg.sender;
    stakingAddress.push(owner);
    mintToken(10000000,owner);
    
  }

  function mintToken(uint amount,address TokenHolder)onlyOwner private{
    ERC20._mint(TokenHolder, amount);
  }

  function allTokensMinted()public view returns(uint){
    return ERC20.totalSupply();
  }

  function gettotalEligbles()public view returns(uint){
    return stakingAddress.length;
  }
  function getTotalUserStaked()public view returns(uint){
    return stakedAddressDetails.length;
  }
  function getTotalUserStakedDetails()public view returns(stakingDetails [] memory ){
    return stakedAddressDetails;
  }
    function getUserStakedDetails()public view returns(stakingDetails memory){

    require(addressStakeStatus[msg.sender],"no staking found");

    uint index = addressToStakingDetails[msg.sender];
    return stakedAddressDetails[index];
  }

  function stakedTimeRemained(address _address)public view returns(uint){
    require(addressStakeStatus[_address] == true , "no funds staked");

    uint index = addressToStakingDetails[_address];

    uint remainedTime = stakedAddressDetails[index].TimestakedEnd - stakedAddressDetails[index].TimeStaked;

    console.log(stakedAddressDetails[index].TimestakedEnd, stakedAddressDetails[index].TimeStaked);

    remainedTime /= (24 * 3600);

    return remainedTime;
  }
   function stakedTime(address _address)public view returns(uint){
    
    uint index = addressToStakingDetails[_address];

    uint remainedTime = stakedAddressDetails[index].TimestakedEnd - stakedAddressDetails[index].TimeStaked;

    console.log(stakedAddressDetails[index].TimestakedEnd, stakedAddressDetails[index].TimeStaked);

    remainedTime /= (24 * 3600);

    return remainedTime;
  }

  receive()external payable{

  }

  function contractBalance()public view returns(uint){
    
    return address(this).balance;
  }

  function makeEligible(address _address)onlyOwner public{
    require(eligibleAddress[_address] == false, "your eligible no need for procedure");

    eligibleAddress[_address]=true;

    addressToIndex[_address];

    stakingAddress.push(_address);
  }

  function stakingETH(uint time) external payable{

    uint timeStamp = time;

    require(eligibleAddress[msg.sender] == true, "your eligible no need for procedure");
    require(addressStakeStatus[msg.sender] == false , "your are still Staking");
    require(msg.value >= 1 ether, "not sufficient fund");
    require(timeStamp >= 7 days,"staking period  is too short");

    addressStakeStatus[msg.sender]=true;
    
    stakingDetails memory StakingDetails =  stakingDetails(msg.sender , block.timestamp,
                                                          block.timestamp + timeStamp , msg.value);
    addressToStakingDetails[msg.sender] = getTotalUserStaked();
    
    stakedAddressDetails.push(StakingDetails);
  }

  function unstakeETH()external payable returns(uint){
    uint userStakedIndex = addressToStakingDetails[msg.sender];

    require(block.timestamp >= stakedAddressDetails[userStakedIndex].TimestakedEnd , "staking period is not finished");

    uint totalUserStaked = getTotalUserStaked();

    uint stakedAmount = stakedAddressDetails[userStakedIndex].stakedAmount;

    uint TokenReward = calculateTokenReward(msg.sender); 

    beforeUnstaking(msg.sender,userStakedIndex,totalUserStaked);

    payable(msg.sender).transfer(stakedAmount);

    ERC20._transfer(owner,msg.sender, TokenReward);

    return TokenReward;
  }

  function beforeUnstaking(address user, uint userIndex ,uint lastIndex)private{
    if(userIndex == lastIndex-1){

      addressStakeStatus[user] = false;
      delete addressToStakingDetails[user];
      delete stakedAddressDetails[userIndex];

    }
    else{

      addressStakeStatus[user] = false;

      stakedAddressDetails[userIndex] = stakedAddressDetails[lastIndex -1];

      delete addressToStakingDetails[user];

      address lastStakedAddress = stakedAddressDetails[lastIndex -1].user;

      addressToStakingDetails[lastStakedAddress] = userIndex;
    }

  }

  function calculateTokenReward(address _address) public view returns(uint){
    uint _stakedTime = stakedTime(_address);
    
    uint rewardTokens = _stakedTime * 5;

    return rewardTokens;
  }

  function destroyContract()onlyOwner public{
    selfdestruct(payable(owner));
  }

}