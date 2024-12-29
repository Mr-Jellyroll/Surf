import React, { useState } from "react";
import { connectWallet } from "./WalletConnector";
import DonationForm from "./components/DonationForm";
import NFTViewer from "./components/NFTViewer";
import abi from "./contractAbi.json";

const App = () => {
  const [userAddress, setUserAddress] = useState("");

  const handleConnect = async () => {
    const account = await connectWallet();
    if (account) setUserAddress(account);
  };

  return (
    <div>
      <button onClick={handleConnect}>
        {userAddress ? `Connected: ${userAddress.slice(0,6)}...` : 'Connect Wallet'}
      </button>
      {userAddress && (
        <>
          <DonationForm
            contractAddress={process.env.REACT_APP_CONTRACT_ADDRESS}
            abi={abi}
            userAddress={userAddress}
          />
          <NFTViewer
            contractAddress={process.env.REACT_APP_CONTRACT_ADDRESS}
            abi={abi}
            userAddress={userAddress}
          />
        </>
      )}
    </div>
  );
};

export default App;