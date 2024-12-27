// import '../styles/Main.css'

import React, { useState, useEffect} from 'react';
import { useWeb3, useProvider } from '../utils/Context';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

export const Main = () => {
  const navigate = useNavigate();
  const { account } = useWeb3();
  const provider = useProvider();
  const [ethereumAddress, setEthereumAddress] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    if (account) {
      setEthereumAddress(account);
      
      const fetchBalance = async () => {
        try {
          if (provider && account) {
            const balance = await provider.getBalance(account);
            setBalance(ethers.formatEther(balance));
          }
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      };
      
      fetchBalance();
    }
  }, [account, provider]);

  return (
    <div className="App">
      <div className="App-header">
        <p>My Address: {ethereumAddress}</p>
        <p>Balance: {balance} ETH</p>
        <button onClick={()=>navigate('/jobs')}>View All Pending Jobs</button>
        <button onClick={()=>navigate('/CreateJob')}>Create a Job</button>        
      </div>
    </div>
  );
};
