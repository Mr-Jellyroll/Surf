import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import { ethers } from "ethers";

const APP_NAME = "SurfForCF";
const CHAIN_ID = 11155111; // Sepolia chain ID

export const connectWallet = async () => {
  try {
    const wallet = new CoinbaseWalletSDK({
      appName: APP_NAME,
      appLogoUrl: "/logo.png", // Add your logo path
      darkMode: false
    });

    const ethereum = wallet.makeWeb3Provider(
      process.env.REACT_APP_SEPOLIA_RPC_URL,
      CHAIN_ID
    );

    const provider = new ethers.BrowserProvider(ethereum);
    const accounts = await ethereum.request({
      method: "eth_requestAccounts"
    });

    // Request network switch if not on Sepolia
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError) {
      // Handle chain not added to wallet
      if (switchError.code === 4902) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: `0x${CHAIN_ID.toString(16)}`,
            chainName: "Sepolia",
            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
            rpcUrls: [process.env.REACT_APP_SEPOLIA_RPC_URL],
            blockExplorerUrls: ["https://sepolia.etherscan.io"]
          }]
        });
      }
    }

    return accounts[0];
  } catch (error) {
    console.error("Wallet connection failed:", error);
    return null;
  }
};