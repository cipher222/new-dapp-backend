//Imports
const { network, ethers } = require("hardhat")
const { hexify, keccak256, RLP } = require("ethers")
// const { developmentChains, networkConfig } = require("../helper-hardhat-config")
require("dotenv").config()

console.log("deploying core contracts...")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  let deployerNonce = await ethers.provider.getTransactionCount(deployer)

  /// *************************
  /// ***Core Solidity Files***
  /// *************************

  //Precompute Hub Address
  const LenseHubNonce = ethers.utils.hexlify(deployerNonce + 1)
  const NFTargs =
    "0x" +
    ethers.utils
      .keccak256(ethers.utils.RLP.encode([deployer, LenseHubNonce]))
      .substr(26)
  ;("0xe7f1725e7734ce288f8367e1bb143e90bb3f0512")
  //Deploy CollectNFT and FollowNFT
  const followNFT = await deploy("CollectNFT", {
    from: deployer,
    args: NFTargs,
    log: true,
    waitConfirmations: network.config.blockConfirmations,
  })

  const collectNFT = await deploy("FollowNFT", {
    from: deployer,
    args: NFTargs,
    log: true,
    waitConfirmations: network.config.blockConfirmations,
  })
  //Deploy LenseHub
  const args = [followNFT, collectNFT]

  const LenseHub = await deploy("RandomIpfsNft", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations,
  })
  log("deployed core contracts!")
  log("------------------------------------------------")
  log("deploying modules...")

  /// *************
  /// ***Modules***
  /// *************
}
module.exports.tags = ["all", "core", "main"]
