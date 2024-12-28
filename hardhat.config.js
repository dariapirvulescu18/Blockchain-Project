require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  networks: {
    hardhat: {
      chainId: 31337,
      mining: {
        interval: 100 // ms
      }
    },
    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545"
    }
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};