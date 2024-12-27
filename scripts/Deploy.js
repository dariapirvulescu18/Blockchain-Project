const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    // Get the contract factory
    const JobPlatform = await hre.ethers.getContractFactory("JobPlatform");
    
    // Deploy the contract
    const jobPlatform = await JobPlatform.deploy();
    await jobPlatform.waitForDeployment();
    
    // Get the contract address
    const contractAddress = await jobPlatform.getAddress();
    console.log("Contract deployed to:", contractAddress);

    // Prepare the address data
    const addressData = {
        address: contractAddress,
        network: hre.network.name
    };

    // Write to src directory so frontend can access it
    const addressPath = path.join(__dirname, '../src/contractAddress.json');
    fs.writeFileSync(
        addressPath,
        JSON.stringify(addressData, null, 2)
    );
}

// Run deployment
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
