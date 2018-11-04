const ganache = require('ganache-cli');
const Web3 = require('web3')

const web3 = new Web3(ganache.provider());

web3.eth.getAccounts().then(fetchedAccounts =>{
    console.log(fetchedAccounts);
});

async function test() {
    let accountsAwait  = await web3.eth.getAccounts()
    console.log(accountsAwait)
}
test()

