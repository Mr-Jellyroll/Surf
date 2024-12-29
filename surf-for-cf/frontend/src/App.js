import React, { useState } from "react";
import WalletConnector from "./components/WalletConnector";
import DonationForm from "./components/DonationForm";
import NFTViewer from "./components/NFTViewer";

function App() {
  const [provider, setProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  const handleWalletConnected = (provider, walletAddress) => {
    setProvider(provider);
    setWalletAddress(walletAddress);
  };

  return (
    <div>
      <h1>Surf for Cystic Fibrosis</h1>
      {!walletAddress ? (
        <WalletConnector onWalletConnected={handleWalletConnected} />
      ) : (
        <>
          <DonationForm provider={provider} walletAddress={walletAddress} />
          <NFTViewer provider={provider} walletAddress={walletAddress} />
        </>
      )}
    </div>
  );
}

export default App;
