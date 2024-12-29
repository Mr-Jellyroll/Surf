import React, { useState } from "react";
import { ethers } from "ethers";

const DonationForm = ({ contractAddress, abi }) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const donate = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.donate({
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      alert("Donation successful!");
      setAmount("");
    } catch (error) {
      console.error("Donation failed:", error);
      alert("Donation failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        type="number"
        placeholder="Amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={isLoading}
      />
      <button onClick={donate} disabled={isLoading}>
        {isLoading ? "Processing..." : "Donate"}
      </button>
    </div>
  );
};

export default DonationForm;