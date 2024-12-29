const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const RPC_URL = process.env.SEPOLIA_RPC_URL;
  const WALLET_ADDRESS = process.env.WALLET_ADDRESS;

  if (!RPC_URL) {
    console.error("Error: RPC_URL is not defined. Check your .env file.");
    return;
  }
  if (!WALLET_ADDRESS) {
    console.error("Error: WALLET_ADDRESS is not defined. Check your .env file.");
    return;
  }

  console.log("Connecting to RPC URL:", RPC_URL);
  console.log("Using Wallet Address:", WALLET_ADDRESS);

  try {
    // Connect to the network
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    // Fetch wallet balance
    const balance = await provider.getBalance(WALLET_ADDRESS);

    // Display balance in ETH
    console.log(`Balance for ${WALLET_ADDRESS}: ${ethers.formatEther(balance)} ETH`);
  } catch (error) {
    console.error("Error fetching balance:", error.message);
  }
}

main();
