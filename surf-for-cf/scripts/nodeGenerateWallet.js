const { Wallet } = require("ethers");

async function generateWallet() {
  const wallet = Wallet.createRandom();
  console.log("Address:", wallet.address);
  console.log("Private Key:", wallet.privateKey);
  console.log("Mnemonic:", wallet.mnemonic.phrase);
}

generateWallet();
