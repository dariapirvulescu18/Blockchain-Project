import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import JobPlatformArtifact from '../artifacts/contracts/JobPlatform.sol/JobPlatform.json';
import JobArtifact from '../artifacts/contracts/Job.sol/Job.json';
// import contractAddress from '../contracts/contract-address.json';

const Web3Context = createContext(null);

export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);

          // Check if already connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            setSigner(signer);
            await handleAccountsChanged(accounts);
          } else {
            // Only request accounts if not already connected
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const signer = await provider.getSigner();
            setSigner(signer);
            const newAccounts = await provider.listAccounts();
            if (newAccounts.length > 0) {
              await handleAccountsChanged(newAccounts);
            }
          }

          // Listen for account changes
          window.ethereum.on('accountsChanged', handleAccountsChanged);
        } catch (error) {
          console.error("Error initializing Web3:", error);
        }
      } else {
        console.log("Please install MetaMask!");
      }
    };

    init();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length > 0 && provider) {
      const account = accounts[0];
      setAccount(account);
      try {
        const balance = await provider.getBalance(account);
        setBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error("Error getting balance:", error);
      }
    } else {
      setAccount(null);
      setBalance(null);
    }
  };

  const initializeWallet = async (newSigner) => {
    try {
      setSigner(newSigner);
      const address = await newSigner.getAddress();
      setAccount(address);
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error initializing wallet:", error);
    }
  };

  return (
    <Web3Context.Provider value={{ 
      provider, 
      signer, 
      account, 
      balance,
      isConnected: !!account,
      initializeWallet
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useProvider() {
  const context = useContext(Web3Context);
  return context.provider;
}

import contractAddress from '../contractAddress.json';
const jobPlatformAddress = contractAddress.address;
export const JobPlatformContract = new ethers.Contract(jobPlatformAddress, JobPlatformArtifact.abi);

export function useJobContract(jobAddress) {
  return new ethers.Contract(jobAddress, JobArtifact.abi);
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}