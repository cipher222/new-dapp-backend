const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  /*
Currency: Deploys ERC20
Helper: Returns blocknumber
MockFollowModule: Provides a follow module interface for local testing
*/
  if (chainId == 31337) {
    log("Local network detected! Deploying mocks...")
    await deploy("Currency", {
      from: deployer,
      log: true,
    })
    await deploy("Helper", {
      from: deployer,
      log: true,
    })
    await deploy("MockFollowModule", {
      from: deployer,
      log: true,
    })
  }
}
module.exports.tags = ["all", "mocks", "main"]
