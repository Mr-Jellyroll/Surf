import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const NFTViewer = ({ contractAddress, abi, userAddress }) => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(
          process.env.REACT_APP_SEPOLIA_RPC_URL
        );
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const tokenIds = await contract.getDonorTokens(userAddress);
        setNfts(tokenIds);
      } catch (error) {
        console.error("Failed to fetch NFTs:", error);
      }
    };

    if (userAddress) {
      fetchNFTs();
    }
  }, [userAddress, contractAddress, abi]);

  return (
    <div>
      <h3>Your NFTs:</h3>
      <ul>
        {nfts.map((id) => (
          <li key={id.toString()}>NFT ID: {id.toString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default NFTViewer;