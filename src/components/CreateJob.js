import { useState, useEffect } from 'react';
import { useWeb3, JobPlatformContract } from '../utils/Context';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import Path from '../routes/path';

export function CreateJob() {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [days, setDays] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const { account } = useWeb3();
  const navigate = useNavigate();
  // useEffect(() => {
  //   console.log("account:", account);
  // }, [account]);

  const createJob = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      if (!account) {
        throw new Error("Wallet not connected");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const feeData = await provider.getFeeData();

      let gasPrice = feeData.gasPrice;
      const gasPriceInEth = ethers.formatUnits(gasPrice, 'ether');
      const userConfirmed = window.confirm("Do you want to create this job? Estimated gas cost: " + gasPriceInEth + " ETH");
      
      const connectedContract = JobPlatformContract.connect(signer);
      
      if(userConfirmed) {
        const tx = await connectedContract.createJob(
          description,
          ethers.parseEther(price.toString()),
          parseInt(days)
        );

        await tx.wait();
      }

      setDescription('');
      setPrice(0);
      setDays(0);

      navigate(Path.MAIN);
      
    } catch (error) {
      console.error("Failed to create job:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="form-container ">
      <form onSubmit={createJob}>
        <div className="form-group ">
          <input
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            placeholder="Price (ETH)"
            value={price === 0 ? '' : price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            step="1"
            min="1"
            required
          />
          <input
            placeholder="Duration (days)"
            value={days === 0 ? '' : days}
            onChange={(e) => setDays(e.target.value)}
            type="number"
            min="1"
            required
          />
          <button 
            type="submit"
            disabled={isCreating || !account }
          >
            {isCreating ? 'Creating...' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateJob;