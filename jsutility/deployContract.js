var path = require('path');
var Web3 = require('web3');
var events = require('events');

var Tx = require('ethereumjs-tx');
var ethUtil = require('ethereumjs-util');
ethUtil.crypto = require('crypto');

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var fs = require('fs');
var srcDir = typeof(__dirname) == 'undefined' ? '' : __dirname;
var content = fs.readFileSync(path.join(srcDir, "privacyTokenBase.sol"), 'utf8');

//var content = fs.readFileSync("beida.js", 'utf8');
var solc = require('solc');
var compiled = solc.compile(content, 1);
var myTestContract = web3.eth.contract(JSON.parse(compiled.contracts[':PrivacyTokenBase'].interface));

console.log(compiled.contracts[':PrivacyTokenBase'].interface);

var config_privatekey = 'a4369e77024c2ade4994a9345af5c47598c7cfb36c65e8a4a3117519883d9014';
var config_pubkey = '0x2d0e7c0813a51d3bd1d08246af2a8a7a57d8922e'


	var constructorInputs = [];

	constructorInputs.push({ data: compiled.contracts[':PrivacyTokenBase'].bytecode});
	var txData = myTestContract.new.getData.apply(null, constructorInputs);

	//TODO: replace user's private key
	var privateKey = new Buffer(config_privatekey, 'hex');
	var amount = web3.toWei(0, 'ether');
	var bn = new web3.BigNumber(amount);
	var hexValue = '0x' + bn.toString(16);
	//TODO: replace with user address
	var serial = '0x' + web3.eth.getTransactionCount(config_pubkey).toString(16);
	var rawTx = { 
	  Txtype: '0x1',
	  nonce: serial,
	  gasPrice: '0xb88745', 
	  gasLimit: '0x2000000',
	  to: '',
	  value: hexValue,
	  from: config_pubkey,
	  data: '0x' + txData
	};
	var tx = new Tx(rawTx);
	tx.sign(privateKey);
	var serializedTx = tx.serialize();
	console.log("serializedTx:" + serializedTx.toString('hex'));
	web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash){
	   if(!err){
	   	console.log('tx hash');
	   	console.log(hash);
       }else {
	       console.log(err);
	   }
	});	
