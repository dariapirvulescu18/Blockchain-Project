import { useState, useEffect } from 'react';
import { useWeb3, JobPlatformContract } from '../utils/Context';
import { ethers } from 'ethers';

export function CreateJob() {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [days, setDays] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { account } = useWeb3();

  useEffect(() => {
    console.log("account:", account);
  }, [account]);

  const createJob = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      if (!account) {
        throw new Error("Wallet not connected");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const connectedContract = JobPlatformContract.connect(signer);

      const tx = await connectedContract.createJob(
        description,
        ethers.parseEther(price.toString()),
        parseInt(days),
        { value: ethers.parseEther(price.toString()) } 
      );
      await tx.wait();
      
      setDescription('');
      setPrice('');
      setDays('');
    } catch (error) {
      console.error("Failed to create job:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={createJob}>
        <div className="form-group">
          <input
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            placeholder="Price (ETH)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            step="0.001"
            min="0"
            required
          />
          <input
            placeholder="Duration (days)"
            value={days}
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