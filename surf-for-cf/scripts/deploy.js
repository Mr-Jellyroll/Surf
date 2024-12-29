const hre = require("hardhat");

async function main() {
  try {
    console.log("Starting deployment...");

    // Get the contract factory
    const SurfForCF = await hre.ethers.getContractFactory("SurfForCF");

    // Deploy the contract with constructor args
    console.log("Deploying contract...");
    const surfForCF = await SurfForCF.deploy(
      "Surf For CF",                    // name
      "SURF",                          // symbol
      hre.ethers.parseEther("10"),    // goalAmount (10 ETH)
      hre.ethers.parseEther("0.0001"),  // minDonation (0.0001 ETH)
      "ipfs://YOUR_IPFS_BASE_URI/"     // baseURI for NFT metadata
    );

    // Wait for the deployment transaction to be mined
    await surfForCF.waitForDeployment();

    // Get the deployed contract address
    const address = await surfForCF.getAddress();

    console.log("Contract deployed to:", address);
    console.log("Waiting for block confirmations...");

    // Wait for 6 block confirmations
    await surfForCF.deploymentTransaction().wait(6);

    // Verify the contract
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [
          "Surf For CF",
          "SURF",
          hre.ethers.parseEther("10"),
          hre.ethers.parseEther("0.0001"),
          "ipfs://YOUR_IPFS_BASE_URI/"
        ],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Error verifying contract:", error.message);
    }

    console.log("Deployment complete!");
    console.log("Contract address:", address);
    console.log("Save this address in your .env file as REACT_APP_CONTRACT_ADDRESS");

  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });