import React, { useState } from "react";
import { ethers } from "ethers";
import SurfForCFABI from "../abi/SurfForCF.json";

const contractAddress = "0x4a1C3530dAb1147D41039370Ee35e530003189Ac"; // Fixes the 'contractAddress' is not defined error

function DonationForm({ provider, walletAddress }) {
  const [amount, setAmount] = useState("");

  const handleDonate = async () => {
    if (!provider || !walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const signer = provider.getSigner(walletAddress);
      const contract = new ethers.Contract(contractAddress, SurfForCFABI, signer);

      const tx = await contract.donate({
        value: ethers.parseEther(amount),
      });

      await tx.wait();
      alert("Donation successful! NFT minted.");
    } catch (error) {
      console.error("Donation failed:", error);
      alert("Failed to donate. Check console for details.");
    }
  };

  return (
    <div>
      <h2>Donate to Surf for Cystic Fibrosis</h2>
      <input
        type="text"
        placeholder="Enter amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleDonate}>Donate</button>
    </div>
  );
}

export default DonationForm;
