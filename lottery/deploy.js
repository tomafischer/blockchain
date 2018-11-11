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
        //.deploy({data: bytecode , arguments: ['Hi there!']})
        .deploy({data: bytecode })
        .send({gas: 1000000, from: accounts[0]})

    console.log('Contract deployed to address: ', result.options.address);
}

deploy();
//deploy();
//readMessage('0x8978cD9F811116eCEEF6Fea0A1e6a80Dc194E2af');
//writeMessage('0x8978cD9F811116eCEEF6Fea0A1e6a80Dc194E2af', 'new message');