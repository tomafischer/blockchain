const path = require('path')
const fs = require('fs')
const solc = require('solc')

const Web3 = require('web3')
inboxPath = path.resolve(__dirname, 'contracts','Inbox.sol')
//source = fs.readFileSync(inboxPath,'utf8')
//console.log(solc.compile(source, 1)) 
//solc.compile(source,1)  
console.log('all done')