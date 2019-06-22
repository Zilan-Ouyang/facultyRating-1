const ethers = require('ethers');
const express = require('express');
const bodyParser = require('body-parser');
//server
const server = express();



//interating with contract
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
//console.log(newContract)

//call funtions 
//let addr ='0xaebcc94558237bd8da20accb9e7bd8113c1c63dc';
async function removeFromWhiteList(addr){
    let tx = await newContract.removeFromWhiteList(addr);//'0xaebcc94558237bd8da20accb9e7bd8113c1c63dc'
    return tx;
}
//isWhiteListed();
async function addWhiteList(addr){
    let tx = await newContract.addWhiteList(addr); //'0xaebcc94558237bd8da20accb9e7bd8113c1c63dc'
    return tx;
}

async function sendFeedBack(addr, rate){
    let tx = await newContract.sendFeedBack(addr, rate);
    return tx;
}

//event listener

// newContract.on("addToWhitelist", (author, val) => {
//     console.log("author: ", author);
//     console.log("student:", val)
// })
//server 
server.set('port', 3000)
server.use(bodyParser.json())

server.delete('/removeFromWhiteList', async(req, res)=>{
    let value = await removeFromWhiteList(req.body.addr);
    res.send(value)
})

server.post('/addWhiteList', async(req, res)=>{
    let value = await addWhitelist(req.body.addr);
    res.send(value)

})

server.post('/sendFeedBack', async(req, res)=>{
    let value = await sendFeedBack(req.body.addr, req.body.rate);
    res.send(value)
})
server.listen(3000);