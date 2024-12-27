    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    import "./Job.sol";
    import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

    contract JobPlatform {

        Job[] private jobs;
        mapping(address => Job[]) private employerJobs;
        
        event JobCreated(address jobAddress, address owner, string description, uint price);
        
        AggregatorV3Interface internal priceFeed;

        constructor() {
            priceFeed = AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419); // ETH/USD feed
        }

        function createJob(string memory _description, uint _price, uint numberOfDays) public payable {
            require(msg.value == _price, "Must fund job with exact price");
            
            Job newJob = new Job{value: msg.value}(
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
                if (jobs[i].status() == Job.Status.Pending) {
                    count++;
                }
            }
            Job[] memory pendingJobs = new Job[](count);
            uint currentIndex = 0;
            for (uint i = 0; i < jobs.length; i++) {
                if (jobs[i].status() == Job.Status.Pending) {
                    pendingJobs[currentIndex] = jobs[i];
                    currentIndex++;
                }
            }
            return pendingJobs;
        }
        
        function getEmployerJobs(address employer) public view returns (Job[] memory) {
            return employerJobs[employer];
        }
        
        function getApplicantJobs(address applicant) public view returns (Job[] memory) {
            // First count matching jobs
            uint count = 0;
            for (uint i = 0; i < jobs.length; i++) {
                if (jobs[i].selectedApplicant() == applicant && jobs[i].status() == Job.Status.Completed) {
                    count++;
                }
            }
            
            // Create array with exact size needed
            Job[] memory applicantJobs = new Job[](count);
            uint currentIndex = 0;
            
            // Fill array using index assignment
            for (uint i = 0; i < jobs.length; i++) {
                if (jobs[i].selectedApplicant() == applicant) {
                    applicantJobs[currentIndex] = jobs[i];
                    currentIndex++;
                }
            }
            return applicantJobs;
        }

        function getJobPriceInUSD(address jobAddress) public view returns (uint) {
            Job job = Job(jobAddress);
            uint ethAmount = job.price();
            (, int price,,,) = priceFeed.latestRoundData();
            return convertETHtoUSD(ethAmount, price);
        }

        function convertETHtoUSD(uint ethAmount, int price) private pure returns (uint) {
            return (ethAmount * uint(price)) / 1e8;
        }
    }
