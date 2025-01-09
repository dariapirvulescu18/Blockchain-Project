import '../styles/Main.css'

import React, { useState, useEffect} from 'react';
import { useJobContract } from '../utils/Context';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import Path from '../routes/path';

export const SelectApplicant = () => {
    const location = useLocation();
    const jobAddress = location.state?.jobAddress;
    const [applicants, setApplicants] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
       
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
            navigate(Path.MAIN);
        } catch (error) {
            console.error("Error selecting applicant:", error);
            const reason = error.message.match(/reason="([^"]+)"/)?.[1] || error.message;
            setError(reason);
        }
    };

    return (    
        <div >
            <br></br>
            <h1 style={{ textAlign: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
              <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
              </svg> Select Applicant</h1>
            {error && (
                <div style={{ color: 'red', margin: '10px 0' }}>
                    {error}
                </div>
            )}
            <div className="jobs-list">
                
                {applicants.map((applicant, index) => (
                    <div key={index} className="job-card">
                        
                        <p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                            </svg> Applicant Address: {applicant}</p>
                        <div class="button-container">
                        <button class onClick={() => handleSelectApplicant(applicant)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-arms-up" viewBox="0 0 16 16">
                            <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                            <path d="m5.93 6.704-.846 8.451a.768.768 0 0 0 1.523.203l.81-4.865a.59.59 0 0 1 1.165 0l.81 4.865a.768.768 0 0 0 1.523-.203l-.845-8.451A1.5 1.5 0 0 1 10.5 5.5L13 2.284a.796.796 0 0 0-1.239-.998L9.634 3.84a.7.7 0 0 1-.33.235c-.23.074-.665.176-1.304.176-.64 0-1.074-.102-1.305-.176a.7.7 0 0 1-.329-.235L4.239 1.286a.796.796 0 0 0-1.24.998l2.5 3.216c.317.316.475.758.43 1.204Z"/>
                            </svg> Select This Applicant
                        </button>
                        <button onClick={() => navigate('/InspectAccount', { state: { accountAddress: applicant,jobAddress:jobAddress } })}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16">
                                <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
                                <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
                                <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
                                </svg> See Applicant History
                        </button>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => navigate(Path.MAIN)}> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-arrow-in-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0z"/>
  <path fill-rule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
</svg> Go back to the main page</button>
        </div>
    );
};

