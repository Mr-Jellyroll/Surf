import React, { useState } from "react";
import { ethers } from "ethers";
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";

const COINBASE_APP_NAME = "Surf for CF";
const COINBASE_APP_LOGO_URL = "https://example.com/logo.png"; // Replace with your logo URL
const RPC_URL = "https://sepolia.base.org"; // Base Sepolia Testnet RPC
const CHAIN_ID = 11155111; // Sepolia Chain ID

function WalletConnector({ onWalletConnected }) {
  const [currentWallet, setCurrentWallet] = useState(null);

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const walletAddress = accounts[0];

      setCurrentWallet(walletAddress);
      onWalletConnected(provider, walletAddress);
    } catch (error) {
      console.error("MetaMask connection failed:", error);
    }
  };

  const connectCoinbaseWallet = async () => {
    try {
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: COINBASE_APP_NAME,
        appLogoUrl: COINBASE_APP_LOGO_URL,
      });

      const walletProvider = coinbaseWallet.makeWeb3Provider(RPC_URL, CHAIN_ID);
      const provider = new ethers.BrowserProvider(walletProvider);
      const accounts = await provider.send("eth_requestAccounts", []);
      const walletAddress = accounts[0];

      setCurrentWallet(walletAddress);
      onWalletConnected(provider, walletAddress);
    } catch (error) {
      console.error("Coinbase Wallet connection failed:", error);
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
