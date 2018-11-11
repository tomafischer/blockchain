

//loading contract info
const { interface, bytecode } = require('./compile');
abiContract = JSON.parse(interface);
/*
* You can use a real Ethereum network or a local testnetwork
*/
//using Infura to connect to the Real network
const HDWalletProvider = require('truffle-hdwallet-provider');
const provider = new HDWalletProvider(
    '<passphrase>'
    'https://rinkeby.infura.io/v3/aed3.....');
    
//or use local network
const ganache = require('ganache-cli');
//const provider = ganache.provider();

//instanciating the web3
const Web3 = require('web3');
const web3 = new Web3(provider);

//const web3 = new Web3(provider);

const getAccount = async () => {
    console.log('Getting acounts....');
    accounts  = await web3.eth.getAccounts()
    account = accounts[0];
    console.log('Account used', account);
    return account;
}

const deployContract = async (account) => {
    console.log('Deploying Inbox congtract...')
    inboxContract= await new web3.eth.Contract(abiContract)
    .deploy({data : bytecode, arguments: ['Hi There']})    
    .send({from: account, gas: '1000000'})
    
    console.log('InboxContractAddress: ', inboxContract.options.address);
    return inboxContract.options.address;
}


const callMethodOnContract = async (contractAddress) => {
    //to call a method without triggering a transaction 
    //you don't need an account

    inboxContract = await new web3.eth.Contract(abiContract, contractAddress);
    message = await inboxContract.methods.message().call();
    console.log("Message read from Contract: ", message);
}

const sendTransactionToContract = async(account, contractAddress) => {
    console.log("Sending Transaction to Contract....");
    inboxContract = await new web3.eth.Contract(abiContract, contractAddress);
    //sending Message
    await inboxContract.methods.setMessage("Please pay your bill... Second warning.")
    .send({from: account, gas: '1000000'});
}


const run = async () => {
    account = await getAccount();
    let start = Date.now();
    //Deploy Contract
    contractAddress = await deployContract(account);
    let stop = Date.now();
    console.log('ContractAddress: ' , contractAddress);
    console.log('Time to execute: ', (stop - start)/1000, 'sec\n');
    
    //call Method
    start = Date.now();
    await callMethodOnContract(contractAddress);
    stop = Date.now();
    console.log('Time to execute: ', (stop - start)/1000, 'sec\n');

    start = Date.now();
    await sendTransactionToContract(account, contractAddress);
    stop = Date.now();
    console.log('Time to execute: ', (stop - start)/1000, 'sec\n');
    console.log('Verifying transacation.... reading from Contract');
    await callMethodOnContract(contractAddress);
}

run();
