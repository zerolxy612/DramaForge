import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const hub = await ethers.deployContract("ShortDramaHub", [deployer.address]);
  await hub.waitForDeployment();

  console.log("ShortDramaHub deployed to:", await hub.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
