require("@nomiclabs/hardhat-etherscan");
const hre = require("hardhat");
const fs = require("fs");
const [baseURI] = require("./args");
const networkName = hre.network.name;

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const balance = await deployer.getBalance();
  console.log(`Account balance: ${balance}`);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const contract = await NFT.deploy(baseURI);

  await contract.deployed();

  console.log("NFT deployed to:", contract.address);

  const balanceAfter = await deployer.getBalance();
  console.log(`Account balance after: ${balanceAfter}`);

  const packageJson = JSON.parse(fs.readFileSync("package.json"));
  if (networkName === "rinkeby") {
    packageJson.scripts["verify-rinkeby"] =
      "npx hardhat verify --network rinkeby --constructor-args scripts/args.js " +
      contract.address;
  } else if (networkName === "mainnet") {
    packageJson.scripts["verify-mainnet"] =
      "npx hardhat verify --network mainnet --constructor-args scripts/args.js " +
      contract.address;
  }
  fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
