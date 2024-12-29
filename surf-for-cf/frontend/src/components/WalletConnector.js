import React, { useState } from "react";
import { ethers } from "ethers";
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";


// Configuration Constants
const APP_NAME = "Surf for CF";
const APP_LOGO_URL = "https://example.com/logo.png"; // Replace with your logo URL
const RPC_URL = process.env.REACT_APP_SEPOLIA_RPC_URL;
const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID, 10); // Convert Chain ID to number
const API_KEY = process.env.REACT_APP_COINBASE_API_KEY; // Coinbase SDK API key


function WalletConnector({ onWalletConnected }) {
  const [currentWallet, setCurrentWallet] = useState(null);

  // MetaMask Connection
  const connectMetaMask = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
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
    if (!RPC_URL || !CHAIN_ID) {
      console.error("Missing RPC_URL or CHAIN_ID. Check your environment variables.");
      alert("Wallet connection failed. Check console for details.");
      return;
    }

    console.log("Connecting to Coinbase Wallet...");
    console.log("Using RPC URL:", RPC_URL);
    console.log("Using Chain ID:", CHAIN_ID);
    console.log("Coinbase API Key:", process.env.REACT_APP_COINBASE_API_KEY);


    try {
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: "Surf for CF",
        appLogoUrl: APP_LOGO_URL,
        darkMode: false,
        apiKey: process.env.REACT_APP_COINBASE_API_KEY,
      });

      const ethereum = coinbaseWallet.makeWeb3Provider(RPC_URL, CHAIN_ID);

      // Request account access
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned from Coinbase Wallet.");
      }

      // Log the connected wallet address
      const walletAddress = accounts[0];
      console.log("Connected with Coinbase Wallet:", walletAddress);

      setCurrentWallet(walletAddress);
      onWalletConnected(ethereum, walletAddress);
    } catch (error) {
      console.error("Coinbase Wallet connection failed:", error);
      alert("Failed to connect with Coinbase Wallet. Check console for details.");
    }
  };

  return (
    <div>
      <h2>Connect Your Wallet</h2>
      <button onClick={connectMetaMask}>Connect with MetaMask</button>
      <button onClick={connectCoinbaseWallet}>Connect with Coinbase Wallet</button>
      {currentWallet && <p>Connected Wallet: {currentWallet}</p>}
    </div>
  );
}

export default WalletConnector;
