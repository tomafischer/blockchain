const assert = require('assert');
const ganache = require('ganache-cli');
var Web3 = require('web3');
const provider = ganache.provider()
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

let accounts;
let lottery;

beforeEach(async () => {
    //Get a list of all accounts
    accounts = await web3.eth.getAccounts()
    //console.log(accounts);

    //Use one of those accounts to deploy the contracts
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' })

    //inbox.setProvider(provider);
});

describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[1],
            //gas:1000000, 
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        //console.log(players);
        assert.equal(accounts[1], players[0]);
        assert.equal(1, players.length);
    });

    it('allows mutibple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            //gas:1000000, 
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            //gas:1000000, 
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            //gas:1000000, 
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        //console.log(players);
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it('requires a minimum amount of ether to enter', async () => {
        let executed;
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 2000
            });
            executed = 'success';
        } catch (err) {
            executed = 'fail';
        }
        assert.equal('fail', executed);
    });

    it('requires the contract to creator to pick a winner', async () => {
        //adding a player
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });

        let execute;
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
                //gas: 100000000000
            });
            console.log('winner picked!!!!!')
            execute = 'success';
        } catch (err) {
            //  console.log(err);
            execute = 'fail';
        }

        assert.strictEqual('fail', execute);
    });

    it('sends money to the winner and resets players array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });


        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei('1.8','ether'));
        assert(difference < web3.utils.toWei('2','ether'));

        const players = await lottery.methods.getPlayers().call();
        assert.equal(0, players.length);
        
    });
});

