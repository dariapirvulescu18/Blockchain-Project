import '../styles/Main.css'

import React, { useState, useEffect} from 'react';
import { useJobContract, JobPlatformContract } from '../utils/Context';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';

export const InspectAccount = () => {
    const location = useLocation();
    const accountAddress = location.state?.accountAddress;
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [error, setError] = useState('');

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
        <div>
            {error && <p className="error">{error}</p>}
            <h1>User: {accountAddress}</h1>
            <h2>Applied Jobs:</h2>
            <div className="jobs-list">
                {appliedJobs.map((job, index) => (
                <div key={job.address} className="job-card">
                    <h3>Job #{index + 1}</h3>
                    <p><strong>Contract Address:</strong> <span className="address">{job.address}</span></p>
                    <p><strong>Owner:</strong> <span className="address">{job.owner}</span></p>
                    <p><strong>Description:</strong> {job.description}</p>
                    <p><strong>Price:</strong> {job.price} ETH</p>
                    <p><strong>Duration:</strong> {job.numberOfDays} days</p>
                    <p><strong>Status:</strong> {['NotFunded', 'Pending', 'ApplicantSelected', 'Completed'][job.status]}</p>
                </div>
            ))}
            </div>
        </div>
    )
}

