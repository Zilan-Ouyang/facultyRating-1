const ethers = require('ethers');
require('dotenv').config()
let contractDetail = require('./build/contracts/FacultyRating.json')
let provider = ethers.getDefaultProvider('ropsten');
let ABI = contractDetail.abiDefinition;
//console.log(ABI)
let bytecode = contractDetail.code;

let myWallet = new ethers.Wallet(process.env.pk, provider)

let contractFactory = new ethers.ContractFactory(ABI, bytecode, myWallet);

async function deployContract(){
    let contract = await contractFactory.deploy(["0x5dc59f8f0d5a190068424a9006cf583e7abdd64c"],["0xcb88b6b42c802aed732829bd30416ff962616be0"]);
    await contract.deployed();
    console.log(contract)
}
deployContract();

