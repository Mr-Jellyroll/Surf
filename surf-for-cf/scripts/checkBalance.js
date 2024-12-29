const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const rpcUrl = "https://sepolia.base.org"; // Base Sepolia RPC URL
  console.log("Connecting to RPC URL:", rpcUrl);

  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const walletAddress = process.env.WALLET_ADDRESS; // Load from .env
  console.log("Using Wallet Address:", walletAddress);

  try {
    const balance = await provider.getBalance(walletAddress);
    console.log(`Balance of ${walletAddress}: ${ethers.formatEther(balance)} ETH`);
  } catch (error) {
    console.error("Error fetching balance:", error.message);
  }
}

main().catch((error) => {
  console.error("Script error:", error.message);
  process.exitCode = 1;
});