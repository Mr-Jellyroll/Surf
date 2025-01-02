import React, { useState } from "react";
import { ethers, BrowserProvider } from "ethers";
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";

// Configuration Constants
const APP_NAME = "Surf for CF";
const APP_LOGO_URL = "https://example.com/logo.png"; // Replace with your logo URL
const RPC_URL = process.env.REACT_APP_SEPOLIA_RPC_URL;
const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID, 10); // Convert Chain ID to number

function WalletConnector({ onWalletConnected }) {
  const [currentWallet, setCurrentWallet] = useState(null);

  // MetaMask Connection
  const connectMetaMask = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const walletAddress = accounts[0];
      console.log("Connected with MetaMask:", walletAddress);

      setCurrentWallet(walletAddress);
      onWalletConnected(provider, walletAddress);
    } catch (error) {
      console.error("MetaMask connection failed:", error);
      alert("Failed to connect with MetaMask. Check console for details.");
    }
  };

  // Coinbase Wallet Connection
  const connectCoinbaseWallet = async () => {
    console.log("Connecting to Coinbase Wallet...");
    console.log("Using RPC URL:", RPC_URL);
    console.log("Using Chain ID:", CHAIN_ID);

    if (!RPC_URL || !CHAIN_ID) {
      console.error("Missing RPC_URL or CHAIN_ID. Check your environment variables.");
      alert("Configuration error: Missing RPC_URL or CHAIN_ID.");
      return;
    }

    try {
      // Initialize Coinbase Wallet SDK
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: APP_NAME,
        appLogoUrl: APP_LOGO_URL,
        darkMode: false,
        reloadOnDisconnect: false
      });

      // Create provider with options object
      const ethereum = coinbaseWallet.makeWeb3Provider({
        jsonRpcUrl: RPC_URL,
        chainId: CHAIN_ID
      });
      
      // Create ethers provider
      const provider = new BrowserProvider(ethereum);

      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned from Coinbase Wallet.");
      }

      const walletAddress = accounts[0];
      console.log("Connected wallet address:", walletAddress);
      
      setCurrentWallet(walletAddress);
      onWalletConnected(provider, walletAddress);
      
    } catch (error) {
      console.error("Coinbase Wallet connection failed:", error);
      alert("Failed to connect with Coinbase Wallet. Check console for details.");
    }
  };

  return (
    <div>
      <button onClick={connectMetaMask}>Connect MetaMask</button>
      <button onClick={connectCoinbaseWallet}>Connect Coinbase Wallet</button>
      {currentWallet && <p>Connected wallet: {currentWallet}</p>}
    </div>
  );
}

export default WalletConnector;