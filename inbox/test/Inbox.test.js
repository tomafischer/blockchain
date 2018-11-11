const assert = require('assert');
const ganache = require('ganache-cli');
var Web3 = require('web3');
const provider = ganache.provider()
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const INITIAL_MESSAGE = 'Hi There!'
beforeEach(async () => {
    //Get a list of all accounts
    accounts  = await web3.eth.getAccounts()
        
    
    //Use one of those accounts to deploy the contracts
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: [INITIAL_MESSAGE]})
        .send({from: accounts[0], gas: '1000000'})

    //inbox.setProvider(provider);
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        
        //console.log(inbox);
        assert.ok(inbox.options.address);
        console.log("address: " + inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_MESSAGE);
    });

    it('can change message', async () => {
        await inbox.methods.setMessage('bye').send({from: accounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    });
});
/*
class Car {
    park() {
        return 'stopped';
    }

    drive() {
        return 'vroom';
    }
}

let car;

beforeEach(() =>{
    car = new Car();
});

describe('Car', () =>{
    it('can park', () =>{
        
        assert.equal(car.park(), 'stopped');
    });

    it('can drive', () => {
        const car = new Car();
        assert.equal(car.drive(), 'vroom');
    });
});

*/