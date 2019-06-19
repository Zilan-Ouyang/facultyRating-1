const ethers = require('ethers');
require('dotenv').config()
let contractDetail = require('./build/contracts/FacultyRating.json')
let provider = ethers.getDefaultProvider('ropsten');
let mainnetProvider = ethers.getDefaultProvider('homestead');


let ABI = contractDetail.abiDefinition;
//console.log(ABI)
let bytebode = contractDetail.code;
//create readOnly wallet
let readOnlyWallet = new ethers.Wallet(process.env.pk)
//read and write only wallet
let readAndWriteRopsten = readOnlyWallet.connect(provider);
let myWallet = new ethers.Wallet(process.env.pk, provider) //readOnly

let contractFactory = new ethers.ContractFactory(ABI, bytebode, myWallet);
let contractAddress = "0x5B909f9Fc4f0F74B0c480E437AfE337cE0d7b989";
//Deploy contract
// async function deployContract(){
//     let contract = await contractFactory.deploy();
//     await contract.deployed();
//     console.log(contract)
// }
// deployContract();


//interacting with contract
let contract = new ethers.Contract(contractAddress, ABI, myWallet).connect(provider); //READONLY contract
//console.log(contract)
let newContract = contract.connect(myWallet); //ReadAndWrite contract
console.log(newContract)

//call funtions 
async function isWhiteListed(){
    let tx = await newContract.isWhiteListed('0xaebcc94558237bd8da20accb9e7bd8113c1c63dc');
    console.log("whitelisted???: ", tx);
}
//isWhiteListed();
async function addWhiteList(){
    let tx = await newContract.addWhiteList('0xaebcc94558237bd8da20accb9e7bd8113c1c63dc');
    console.log("add to whitelist?? :", tx)
}
addWhiteList();
//event listener

newContract.on("addToWhitelist", (author, val) => {
    console.log("author: ", author);
    console.log("student:", val)
})