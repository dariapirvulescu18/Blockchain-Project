import '../styles/Main.css'
import '../styles/global.css'
import React, { useState, useEffect} from 'react';
import { useJobContract, JobPlatformContract } from '../utils/Context';
import { useLocation , useNavigate} from 'react-router-dom';
import { ethers } from 'ethers';
import Path from '../routes/path';

export const InspectAccount = () => {
    const location = useLocation();
    const accountAddress = location.state?.accountAddress;
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const jobAddress = location.state?.jobAddress;

    useEffect(() => {
        console.log("Account address", accountAddress);
        const fetchApplicationsHistory = async () => {
            try {
                const _provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await _provider.getSigner();

                const connectedContract = JobPlatformContract.connect(signer);

                const jobsAddresses = await connectedContract.getApplicantJobs(accountAddress);
                
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
                    status: await connectedJobContract.getStatus()
                  };
                  fullJobs.push(jobDetails);
                }
                setAppliedJobs(fullJobs);
                setError('');

            } catch (error) {
                console.error("Error fetching applicantions history:", error);
                setError(error.message);
            }
        };

        if (accountAddress) {
            fetchApplicationsHistory();
        }
    }, [accountAddress]);

    return (
        <div className="inspect-account">
            {error && <p className="error">{error}</p>}
            <h1>User: {accountAddress}</h1>
            <h2>Applied Jobs:</h2>
            {appliedJobs.length === 0 ? (
                <h2>The current user doesn't have any completed jobs to list at the moment.</h2>
            ) : (
                <div className='jobs-list'>
                    {appliedJobs.map((job, index) => (
                        <div key={job.address} className="job-card">
                            <h1 style={{color:"#6041CA"}}>Job #{index + 1}</h1>
                            <p><strong>Contract Address:</strong> <span className="address">{job.address}</span></p>
                            <p><strong>Owner:</strong> <span className="address">{job.owner}</span></p>
                            <p><strong>Description:</strong> {job.description}</p>
                            <p><strong>Price:</strong> {job.price} ETH</p>
                            <p><strong>Duration:</strong> {job.numberOfDays} days</p>
                            <p><strong>Status:</strong> {['NotFunded', 'Pending', 'ApplicantSelected', 'Completed', 'PaymentWithdrawn'][job.status]}</p>
                        </div>
                    ))}
                </div>
                 )}
                 <button onClick={() => navigate(Path.SELECT_APPLICANT,{ state: { jobAddress }})}> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-arrow-in-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0z"/>
  <path fill-rule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
</svg> Go back to selecting the applicant</button>
            </div>
        );
 };
         
export default InspectAccount;