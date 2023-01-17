const { expect } = require("chai");
const hre = require("hardhat");

describe("Token contract", function() {
  
  let token;
  let TKN;
  let owner;
  let addr1;
  let addr2;
  let tokenCap = 1000000000;
  let tokenBlockReward = 50;

  beforeEach(async function () {
    
    token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    TKN = await token.deploy(tokenCap, tokenBlockReward);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await TKN.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await TKN.balanceOf(owner.address);
      expect(await TKN.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped supply to the argument provided during deployment", async function () {
      const cap = await TKN.cap();
      expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokenCap);
    });

    it("Should set the blockReward to the argument provided during deployment", async function () {
      const blockReward = await TKN.blockReward();
      expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(tokenBlockReward);
    });
  });

  describe("Transactions", function () {

    it("Should transfer tokens between accounts", async function () {
     
      await TKN.transfer(addr1.address, 50);
      const addr1Balance = await TKN.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

     
      await TKN.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await TKN.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await TKN.balanceOf(owner.address);
     
      await expect(
        TKN.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      
      expect(await TKN.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await TKN.balanceOf(owner.address);


      await TKN.transfer(addr1.address, 100);

     
      await TKN.transfer(addr2.address, 50);   


      const finalOwnerBalance = await TKN.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await TKN.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await TKN.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
  
});
