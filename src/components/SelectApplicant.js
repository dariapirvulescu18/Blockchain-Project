import '../styles/Main.css'

import React, { useState, useEffect} from 'react';
import { useJobContract } from '../utils/Context';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

export const SelectApplicant = () => {
    const location = useLocation();
    const jobAddress = location.state?.jobAddress;
    const [applicants, setApplicants] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Job Address:", jobAddress);
        const fetchApplicants = async () => {
            try {
                const _provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await _provider.getSigner();
                const jobContract = useJobContract(jobAddress);
                const connectedJobContract = jobContract.connect(signer);
                
                // Fetch applicants from the smart contract
                const applicantList = await connectedJobContract.getApplicants();
                setApplicants(applicantList);
            } catch (error) {
                console.error("Error fetching applicants:", error);
                setError(error.message);
            }
        };

        if (jobAddress) {
            fetchApplicants();
        }
    }, [jobAddress]);

    const handleSelectApplicant = async (applicantAddress) => {
        try {
            const _provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await _provider.getSigner();
            const jobContract = useJobContract(jobAddress);
            const connectedJobContract = jobContract.connect(signer);
            
            const tx = await connectedJobContract.selectApplicant(applicantAddress);
            await tx.wait();
            setError('');
        } catch (error) {
            console.error("Error selecting applicant:", error);
            const reason = error.message.match(/reason="([^"]+)"/)?.[1] || error.message;
            setError(reason);
        }
    };

    return (
        <div>
            <h1>Select Applicant</h1>
            {error && (
                <div style={{ color: 'red', margin: '10px 0' }}>
                    {error}
                </div>
            )}
            <div className="applicants-list">
                {applicants.map((applicant, index) => (
                    <div key={index} className="applicant-card">
                        <p>Applicant Address: {applicant}</p>
                        <button onClick={() => handleSelectApplicant(applicant)}>
                            Select This Applicant
                        </button>
                        <button onClick={() => navigate('/InspectAccount', { state: { accountAddress: applicant } })}>
                            See Applicant History
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

