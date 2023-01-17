const hre = require("hardhat");

async function main() {
  const Zoatoken = await hre.ethers.getContractFactory("Zoatoken");
  const zoatoken = await Zoatoken.deploy(1000000000, 50);

  await zoatoken.deployed();

  console.log("Zoatoken deployed: ", zoatoken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});