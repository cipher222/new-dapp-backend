const { messagePrefix } = require("@ethersproject/hash")
const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const {
  isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Unit Tests", function () {
      let deployer, user1, user2, ourToken, fee //global vars
      beforeEach(async () => {
        const accounts = await getNamedAccounts()
        deployer = accounts.deployer
        user1 = accounts.user1
        user2 = accounts.user2
        await deployments.fixture(["all"])
        randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer)
      })
      describe("Request Nft", () => {
        it("fails if payment isn't sent with the request", async function () {
          await expect(randomIpfsNft.requestNft()).to.be.revertedWith(
            "NeedMoreETHSent"
          )
        })
        it("emits an event and kicks off a random word request", async function () {
          const fee = await randomIpfsNft.getMintFee()
          await expect(
            randomIpfsNft.requestNft({ value: fee.toString() })
          ).to.emit(randomIpfsNft, "nftRequested")
        })
      })
      describe("fulfillRandomWords", () => {
        it("mints NFT after random number is returned", async function () {
          const fee = await randomIpfsNft.getMintFee()
          await randomIpfsNft.requestNft({ value: fee.toString() })
          await new Promise(async (resolve, reject) => {
            randomIpfsNft.once("NftMinted", async () => {
              try {
                const tokenUri = await randomIpfsNft.tokenURI("0")
                const tokenCounter = await randomIpfsNft.getTokenCounter()
                assert.equal(tokenUri.toString().includes("ipfs://"), true)
                assert.equal(tokenCounter.toString(), "1")
                resolve()
              } catch (e) {
                console.log(e)
                reject(e)
              }
            })
          })
        })
      })
    })
