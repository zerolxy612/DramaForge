import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // 1. 部署 DramaHub
  console.log("\n1. Deploying DramaHub...");
  const DramaHub = await ethers.getContractFactory("DramaHub");
  const dramaHub = await DramaHub.deploy(deployer.address);
  await dramaHub.waitForDeployment();
  const dramaHubAddress = await dramaHub.getAddress();
  console.log("   DramaHub deployed to:", dramaHubAddress);
  
  // 2. 部署 AssetRegistry
  console.log("\n2. Deploying AssetRegistry...");
  const AssetRegistry = await ethers.getContractFactory("AssetRegistry");
  const assetRegistry = await AssetRegistry.deploy(
    deployer.address,
    "https://api.drama.example/assets/{id}.json" // 基础 URI
  );
  await assetRegistry.waitForDeployment();
  const assetRegistryAddress = await assetRegistry.getAddress();
  console.log("   AssetRegistry deployed to:", assetRegistryAddress);
  
  // 3. 部署 StoryNodeRegistry
  console.log("\n3. Deploying StoryNodeRegistry...");
  const StoryNodeRegistry = await ethers.getContractFactory("StoryNodeRegistry");
  const storyNodeRegistry = await StoryNodeRegistry.deploy(deployer.address);
  await storyNodeRegistry.waitForDeployment();
  const storyNodeRegistryAddress = await storyNodeRegistry.getAddress();
  console.log("   StoryNodeRegistry deployed to:", storyNodeRegistryAddress);
  
  // 4. 配置合约关联
  console.log("\n4. Configuring contract relationships...");
  
  // DramaHub 设置 StoryNodeRegistry
  await dramaHub.setStoryNodeRegistry(storyNodeRegistryAddress);
  console.log("   DramaHub.setStoryNodeRegistry done");
  
  // StoryNodeRegistry 设置关联合约
  await storyNodeRegistry.setContracts(dramaHubAddress, assetRegistryAddress);
  console.log("   StoryNodeRegistry.setContracts done");
  
  // AssetRegistry 设置 StoryNodeRegistry
  await assetRegistry.setStoryNodeRegistry(storyNodeRegistryAddress);
  console.log("   AssetRegistry.setStoryNodeRegistry done");
  
  // 输出部署信息
  console.log("\n========================================");
  console.log("Deployment completed!");
  console.log("========================================");
  console.log("\nContract Addresses:");
  console.log("  DramaHub:          ", dramaHubAddress);
  console.log("  AssetRegistry:     ", assetRegistryAddress);
  console.log("  StoryNodeRegistry: ", storyNodeRegistryAddress);
  console.log("\nDeployer:", deployer.address);
  console.log("========================================\n");
  
  // 返回地址（用于测试）
  return {
    dramaHub: dramaHubAddress,
    assetRegistry: assetRegistryAddress,
    storyNodeRegistry: storyNodeRegistryAddress,
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
