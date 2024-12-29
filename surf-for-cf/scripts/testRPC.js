const { ethers } = require("ethers");

async function main() {
  // Replace with your RPC URL
  const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/K5n2W4hKP2HkQOETxFlH1zbmg5cirFxi";

  console.log("Testing RPC URL:", RPC_URL);

  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    // Fetch and log the current block number
    const blockNumber = await provider.getBlockNumber();
    console.log("Current Block Number:", blockNumber);

    // Fetch and log network details
    const network = await provider.getNetwork();
    console.log("Connected Network:", network);

    // Test connection by fetching the latest block
    const latestBlock = await provider.getBlock(blockNumber);
    console.log("Latest Block Details:", latestBlock);
  } catch (error) {
    console.error("Error testing RPC URL:", error.message);
  }
}

main();
