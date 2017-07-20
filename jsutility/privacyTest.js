/*
     Testing interface of privacy protected contract
     TODO: add sendOTATransaction for ethereumjs-util
*/
var fs = require('fs');
var path = require('path');
var Web3 = require('web3');
var events = require('events');

var Tx = require('ethereumjs-tx');
var ethUtil = require('ethereumjs-util');
var solc = require('solc');

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var srcDir = typeof(__dirname) == 'undefined' ? '' : __dirname;
var content = fs.readFileSync(path.join(srcDir, "privacyTokenBase.sol"), 'utf8');

var compiled = solc.compile(content, 1);
var privacyContract = web3.eth.contract(JSON.parse(compiled.contracts[':PrivacyTokenBase'].interface));
var contractInstanceAddress = '0x8338f9c5ef60217fb2472a3d56ebcce668e72c1e';
var contractInstance = privacyContract.at(contractInstanceAddress);

var config_privatekey = 'daa2fbee5ee569bc64842f5a386e7037612e0736b52e41749d52b616beaca65e';
var config_address = '0xc29258c409380d34c9255406e8204212da552f92'


//TODO: reset private key buffer immediately after use it
function wchainSendRawTransaction(sender, senderPrivateKey, payload, log){
	var privateKey = new Buffer(senderPrivateKey, 'hex');//from.so_privatekey
	var serial = '0x' + web3.eth.getTransactionCount(sender).toString(16);
	var rawTx = {
	  nonce: serial,
	  gasPrice: '0x43bb88745',
	  gasLimit: '0x400000',
	  to: contractInstanceAddress,//contract address
	  value: '0x00',
	  from: sender,
	  data: '0x' + payload
	};

	var tx = new Tx(rawTx);
	tx.sign(privateKey);
	var serializedTx = tx.serialize();
	web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash){
	   if(!err){
	   	console.log(log + 'tx hash:');
	   	console.log("    " + hash);
       }else {
	       console.log(err);
	   }
	});		
}

function i_initAsset(initialOtaAddress, otaKeyBytes, value){
	payload = contractInstance.initAsset.getData(initialOtaAddress, otaKeyBytes, value);
	wchainSendRawTransaction(config_address, config_privatekey, payload, "call contract initAsset");
}

function i_privacyTransfer(otaSenderAddress, otaReceiverAddress, receiverKeyBytes, value, senderPrivateKey){
	var hash = ethUtil.otaHash(otaSenderAddress, otaReceiverAddress,
		receiverKeyBytes, ethUtil.numberToBytes32(value));
	var sig = ethUtil.otaSign(hash, senderPrivateKey);
	payload = contractInstance.privacyTransfer.getData(
		otaSenderAddress, otaReceiverAddress, receiverKeyBytes, value,
		sig.v,
		'0x' + sig.r.toString('hex'),
		sig.s.toString('hex'));
	//todo:change to ethUtil.sendOTATransaction
	wchainSendRawTransaction(config_address, config_privatekey, payload, "call privacy Transfer");
}

/*
    1. generate a one time Key and compute corresponding private key
*/
var pubkeyStr = ethUtil.publicKeyFromPrivateKey(config_privatekey);
var ota = ethUtil.generateOTAPublicKey(pubkeyStr, pubkeyStr);
var bufOTAPrivate = ethUtil.computeOTAPrivateKey(ota.OtaA1, ota.OtaS1, config_privatekey,config_privatekey);
var otaKeyBytesCompressed = ethUtil.pubkeyStrCompressed(ota.OtaA1) + ethUtil.pubkeyStrCompressed(ota.OtaS1);
var otaAddress = ethUtil.bufferToHex(ethUtil.publicToAddress('0x' + ota.OtaA1));
/*
    2. initAsset value for ota
*/
i_initAsset(otaAddress, otaKeyBytesCompressed, 8888);
//check otaAdress 
contractInstance.balanceOf(otaAdress)
/*
    3.generate another ota address
*/
var otaDest = ethUtil.generateOTAPublicKey(pubkeyStr, pubkeyStr);
var otaDestPrivate = ethUtil.computeOTAPrivateKey(otaDest.OtaA1, otaDest.OtaS1, config_privatekey,config_privatekey);
var otaDestKeyBytesCompressed = ethUtil.pubkeyStrCompressed(otaDest.OtaA1) + ethUtil.pubkeyStrCompressed(otaDest.OtaS1);
var otaDestAddress = ethUtil.bufferToHex(ethUtil.publicToAddress('0x' + otaDest.OtaA1));
//transfer from customized token from ota address
i_privacyTransfer(otaAdress, otaDestAddress, otaDestKeyBytesCompressed, 6666, otaDestPrivate);

//check the balance of otaDestAddress

