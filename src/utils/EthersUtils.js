const ethers = require('ethers');

const provider = new ethers.BrowserProvider(window.ethereum);

const connectWalletMetamask = async (accountChangedHandler) => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    await accountChangedHandler(signer);
    return signer;
  } catch (error) {
    console.error("Failed to connect to MetaMask:", error);
    throw error;
  }
};

const initializeContract = (contractAddress, contractABI) => {
  return new ethers.Contract(contractAddress, contractABI, provider);
};

module.exports = {
  provider,
  connectWalletMetamask,
  initializeContract
};

