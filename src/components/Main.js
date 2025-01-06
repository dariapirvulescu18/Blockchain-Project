import '../styles/Main.css'

import React, { useState, useEffect} from 'react';
import { useWeb3, useProvider, JobPlatformContract, useJobContract } from '../utils/Context';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

export const Main = () => {
  const navigate = useNavigate();
  const { account } = useWeb3();
  const provider = useProvider();
  const [ethereumAddress, setEthereumAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [jobs, setJobs] = useState([]);

  const [error, setError] = useState('');

  const applyForJob = async (jobAddress) => {
    try {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await _provider.getSigner();
      const jobContract = useJobContract(jobAddress);
      const connectedJobContract = jobContract.connect(signer);
      const tx = await connectedJobContract.applyForJob();
      await tx.wait();
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error("Error applying for job:", error);
      // Extract reason from error message
      const reason = error.message.match(/reason="([^"]+)"/)?.[1] || error.message;
      setError(reason);
    }
  }

  const fundJob = async (jobAddress, price) => {
    try {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await _provider.getSigner();
      const jobContract = useJobContract(jobAddress);
      const connectedJobContract = jobContract.connect(signer);
      const tx = await connectedJobContract.fundJob({value: ethers.parseEther(price.toString())});
      await tx.wait();
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error("Error funding job:", error);
      // Extract reason from error message 
      const reason = error.message.match(/reason="([^"]+)"/)?.[1] || error.message;
      setError(reason);
    }
  }

  const withdrawPayment = async (jobAddress) => {
    try {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await _provider.getSigner();
      const jobContract = useJobContract(jobAddress);
      const connectedJobContract = jobContract.connect(signer);
      const tx = await connectedJobContract.withdrawPayment();
      await tx.wait();
      setError(''); // Clear any previous errors
    }
    catch (error) {
      console.error("Error withdrawing payment:", error);
      // Extract reason from error message 
      const reason = error.message.match(/reason="([^"]+)"/)?.[1] || error.message;
      setError(reason);
    }
  }

  const completeJob = async (jobAddress) => {
    try {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await _provider.getSigner();
      const jobContract = useJobContract(jobAddress);
      const connectedJobContract = jobContract.connect(signer);
      const tx = await connectedJobContract.completeJob();
      await tx.wait();
      setError(''); // Clear any previous errors
    }
    catch (error) {
      console.error("Error completing job:", error);
      // Extract reason from error message 
      const reason = error.message.match(/reason="([^"]+)"/)?.[1] || error.message;
      setError(reason);
    }
  }

  // Error display component
  const ErrorDisplay = () => {
    if (!error) return null;
    return (
      <div style={{
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #ef9a9a'
      }}>
        {error}
      </div>
    );
  }

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
      const fetchJobs = async () => {
        try {

          const _provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await _provider.getSigner();

          const connectedContract = JobPlatformContract.connect(signer);

          const jobsAddresses = await connectedContract.getJobs();
          
          const fullJobs = [];

          for (const jobAddress of jobsAddresses) {
            const jobContract = useJobContract(jobAddress);
            const connectedJobContract = jobContract.connect(signer);
            const jobDetails = {
              address: jobAddress,
              owner: await connectedJobContract.getOwner(),
              description: await connectedJobContract.getDescription(),
              price: ethers.formatEther(await connectedJobContract.getPrice()),
              numberOfDays: await connectedJobContract.getNumberOfDays(),
              status: await connectedJobContract.getStatus(),
              selectedApplicant: await connectedJobContract.getSelectedApplicant(),
              applicants: await connectedJobContract.getApplicants()
            };
            fullJobs.push(jobDetails);
          }

          setJobs(fullJobs);
        } catch (error) {
          console.error("Error fetching jobs:", error);
        }
      };

      fetchJobs();

      console.log(account)
    }
  }, [account, provider]);

  return (
    <div className="App">
      <ErrorDisplay />
      <div className="App-header">
        <div className="wallet-info">
          <p><strong>My Address:</strong> {ethereumAddress}</p>
          <p><strong>Balance:</strong> {balance} ETH</p>
        </div>
        <button onClick={()=>navigate('/CreateJob')}>Create a Job</button>        
      </div>
      <div className="jobs-list">
        {jobs.map((job, index) => (
          <div key={job.address} className="job-card">
            <h3>Job #{index + 1}</h3>
            <p><strong>Contract Address:</strong> <span className="address">{job.address}</span></p>
            <p><strong>Owner:</strong> <span className="address">{job.owner}</span></p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Price:</strong> {job.price} ETH</p>
            <p><strong>Duration:</strong> {job.numberOfDays} days</p>
            <p><strong>Status:</strong> {['NotFunded', 'Pending', 'ApplicantSelected', 'Completed'][job.status]}</p>
            <p><strong>Selected Applicant:</strong> <span className="address">{job.selectedApplicant}</span></p>
            <p><strong>Number of Applicants:</strong> {job.applicants.length}</p>
            <button 
              onClick={() => applyForJob(job.address)}
            >
              Apply for Job
            </button>
            <button 
              onClick={() => fundJob(job.address, job.price)}
            >
              Fund Job
            </button>
            <button 
              onClick={() => navigate('/SelectApplicant', { state: { jobAddress: job.address } })}
            >
              Select Applicant
            </button>
            <button 
              onClick={() => withdrawPayment(job.address)}
            >
              Withdraw Payment
            </button>
            <button 
              onClick={() => completeJob(job.address)}
            >
              Complete Job
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
