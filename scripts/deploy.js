const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  
  const VoteSafe = await hre.ethers.getContractFactory("VoteSafe", deployer);
  const votesafe = await VoteSafe.deploy();
  await votesafe.waitForDeployment(); // Corrected line
  
  console.log("VoteSafe deployed to:", await votesafe.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});