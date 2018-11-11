const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    '<passphrase>'
    'https://rinkeby.infura.io/v3/aed3.....');

const web3 = new Web3(provider);


const deploy = async () => {
    const accounts  = await web3.eth.getAccounts();
    console.log('Accounts found: ' + accounts);
    console.log('Account used for deployment: ', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode , arguments: ['Hi there!']})
        .send({gas: 1000000, from: accounts[0]})

    console.log('Contract deployed to address: ', result.options.address);
}

const readMessage = async (contractId) => {
    inbox  = await new web3.eth.Contract(JSON.parse(interface),contractId);
    message = await inbox.methods.message().call();
    console.log(message);
}

const writeMessage = async (contractId, message) => {
    const accounts  = await web3.eth.getAccounts();
    inbox = await new web3.eth.Contract(JSON.parse(interface),contractId);
    console.log('Setting message');
    await inbox.methods.setMessage(message)
        .send({from: accounts[0], gas: 1000000});
    returnMessage = await inbox.methods.message().call();
    console.log('Return Message:', returnMessage);
}

//deploy();
//readMessage('0x8978cD9F811116eCEEF6Fea0A1e6a80Dc194E2af');
writeMessage('0x8978cD9F811116eCEEF6Fea0A1e6a80Dc194E2af', 'new message');