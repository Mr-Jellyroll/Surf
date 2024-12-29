//
import React from 'react';
import { useState, useEffect } from 'react';
import { CoinbaseWallet } from '@coinbase/wallet-sdk';
import DonationForm from './components/DonationForm';
import NFTGallery from './components/NFTGallery';
import ProgressBar from './components/ProgressBar';
import useWallet from './hooks/useWallet';

const App = () => {
  const { account, connect, isConnected } = useWallet();
  const [campaign, setCampaign] = useState({
    totalRaised: 0,
    goalAmount: 0,
    donorCount: 0
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      <nav className="p-4 bg-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Surf for CF</h1>
          <button
            onClick={connect}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {isConnected ? `Connected: ${account.slice(0, 6)}...` : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ProgressBar
              raised={campaign.totalRaised}
              goal={campaign.goalAmount}
            />
            <DonationForm
              isConnected={isConnected}
              account={account}
            />
          </div>
          <NFTGallery account={account} />
        </div>
      </main>
    </div>
  );
};

export default App;

// src/components/DonationForm.js
import React, { useState } from 'react';
import { useDonate } from '../hooks/useDonate';

const DonationForm = ({ isConnected, account }) => {
  const [amount, setAmount] = useState('');
  const { donate, isLoading } = useDonate();

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!isConnected) return;
    await donate(amount);
    setAmount('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Make a Donation</h2>
      <form onSubmit={handleDonate}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Donation Amount (ETH)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0.1"
            min="0.01"
          />
        </div>
        <button
          type="submit"
          disabled={!isConnected || isLoading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {isLoading ? 'Processing...' : 'Donate'}
        </button>
      </form>
    </div>
  );
};

export default DonationForm;

// src/hooks/useWallet.js
import { useState, useEffect } from 'react';
import { CoinbaseWallet } from '@coinbase/wallet-sdk';

const useWallet = () => {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    try {
      const coinbaseWallet = new CoinbaseWallet({
        appName: 'Surf for CF',
        appLogoUrl: '/assets/images/logo.png',
        darkMode: false
      });

      const accounts = await coinbaseWallet.enable();
      setAccount(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return { account, isConnected, connect };
};

export default useWallet;