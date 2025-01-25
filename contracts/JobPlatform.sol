    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    import "./Job.sol";

    contract JobPlatform {

        Job[] private jobs;
        mapping(address => Job[]) private employerJobs;
        
        event JobCreated(address jobAddress, address owner, string description, uint price);
        

        function createJob(string memory _description, uint _price, uint numberOfDays) public {
            
            Job newJob = new Job(
                msg.sender,
                _description,
                _price,
                numberOfDays
            );
            
            jobs.push(newJob);
            employerJobs[msg.sender].push(newJob);
            
            emit JobCreated(address(newJob), msg.sender, _description, _price);
        }
        
        function getJobs() public view returns (Job[] memory) {
            return jobs;
        }

        function getPendingJobs() public view returns (Job[] memory) {
            uint count = 0;
            for (uint i = 0; i < jobs.length; i++) {
                if (jobs[i].getStatus() == Job.Status.Pending) {
                    count++;
                }
            }
            Job[] memory pendingJobs = new Job[](count);
            uint currentIndex = 0;
            for (uint i = 0; i < count; i++) {
                if (jobs[i].getStatus() == Job.Status.Pending) {
                    pendingJobs[currentIndex] = jobs[i];
                    currentIndex++;
                }
            }
            return pendingJobs;
        }

        function getPaymentWithdrownJobs() public view returns (Job[] memory){
            uint count = 0;
            for (uint i = 0; i < jobs.length; i++) {
                if (jobs[i].isPaymentWithdrawn()) {
                    count++;
                }
            }
            Job[] memory paidJobs = new Job[](count);
            uint currentIndex = 0;
            for (uint i = 0; i < count; i++) {
                if (jobs[i].isPaymentWithdrawn()) {
                    paidJobs[currentIndex] = jobs[i];
                    currentIndex++;
                }
            }
            return paidJobs;
        }
        
        function getEmployerJobs(address employer) public view returns (Job[] memory) {
            return employerJobs[employer];
        }
        
        function getApplicantJobs(address applicant) public view returns (Job[] memory) {
            // First count matching jobs
            uint count = 0;
            for (uint i = 0; i < jobs.length; i++) {
                if (jobs[i].getSelectedApplicant() == applicant && (jobs[i].getStatus() == Job.Status.Completed ||
                    jobs[i].getStatus() == Job.Status.PaymentWithdrawn)) {
                    count++;
                }
            }
            
            // Create array with exact size needed
            Job[] memory applicantJobs = new Job[](count);
            uint currentIndex = 0;
            
            // Fill array using index assignment
            for (uint i = 0; i < count; i++) {
                if (jobs[i].getSelectedApplicant() == applicant) {
                    applicantJobs[currentIndex] = jobs[i];
                    currentIndex++;
                }
            }
            return applicantJobs;
        }

    }
