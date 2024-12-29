const { Wallet } = require("ethers");

async function generateWallet() {
  // Generate a random wallet
  const wallet = Wallet.createRandom();

  console.log("New Wallet Generated:");
  console.log("Address:", wallet.address);
  console.log("Private Key:", wallet.privateKey);
  console.log("Mnemonic Phrase:", wallet.mnemonic.phrase);

  // Save the wallet data to a file if needed
  const fs = require("fs");
  const walletData = {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
  };
  fs.writeFileSync("wallet.json", JSON.stringify(walletData, null, 2));
  console.log("Wallet saved to wallet.json");
}

generateWallet();
