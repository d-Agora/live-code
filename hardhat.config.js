require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("dotenv").config();

// const tokenURI = require("./scripts/contractFunctions/tokenURI");

const owner = process.env.PK;

module.exports = {
  networks: {
    hardhat: {},
    mainnet: {
      url: "https://mainnet.infura.io/v3/" + process.env.INFURA_ID,
      accounts: [`0x${owner}`],
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/" + process.env.INFURA_ID,
      accounts: [`0x${owner}`],
    },
  },
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  mocha: {
    timeout: 300000,
  },
  gasReporter: {
    enabled: process.env.COINMARKETCAP_API_KEY !== undefined,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY || "",
    token: "BNB",
    gasPriceApi: "https://api.bscscan.com/api?module=proxy&action=eth_gasPrice",
  },
  etherscan: {
    apiKey: {
      // ethereum
      mainnet: process.env.ETHERSCAN_API_KEY,
      rinkeby: process.env.ETHERSCAN_API_KEY,
      // binance
      bsc: process.env.BSCSCAN_API_KEY || "",
      bscTestnet: process.env.BSCSCAN_API_KEY || "",
      // polygon
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
    },
  },
};

// task("tokenURI", "get token URI")
//   .addParam("tokenid", "Token ID")
//   .setAction(async (args) => {
//     await tokenURI(args.tokenId);
//   });
