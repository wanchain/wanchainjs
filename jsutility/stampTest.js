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
var content = fs.readFileSync(path.join(srcDir, "WanchainStamps.sol"), 'utf8');

var compiled = solc.compile(content, 1);
var privacyContract = web3.eth.contract(JSON.parse(compiled.contracts[':WanchainStamps'].interface));
//next line can used in cli debug
//var privacyContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"initialBase","type":"address"},{"name":"baseKeyBytes","type":"bytes"},{"name":"value","type":"uint256"}],"name":"initAsset","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"tfrom","type":"address"},{"name":"tto","type":"address"},{"name":"keyBytes","type":"bytes"},{"name":"_value","type":"uint256"},{"name":"sigv","type":"uint8"},{"name":"sigr","type":"bytes32"},{"name":"sigs","type":"bytes32"}],"name":"privacyTransfer","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"setAddress","type":"address"},{"name":"value","type":"uint256"}],"name":"directDeposit","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"tfrom","type":"address"},{"name":"tto","type":"address"},{"name":"keyBytes","type":"bytes"},{"name":"_value","type":"uint256"}],"name":"signBytes","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"tfrom","type":"address"},{"name":"tto","type":"address"},{"name":"keyBytes","type":"bytes"},{"name":"value","type":"uint256"},{"name":"sigv","type":"uint8"},{"name":"sigr","type":"bytes32"},{"name":"sigs","type":"bytes32"}],"name":"sigCheck","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"},{"name":"sigv","type":"uint8"},{"name":"sigr","type":"bytes32"},{"name":"sigs","type":"bytes32"}],"name":"sigCheckByHash","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"v","type":"uint256"}],"name":"uintToBytes","outputs":[{"name":"ret","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"mInitialized","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"tfrom","type":"address"},{"name":"tto","type":"address"},{"name":"value","type":"uint256"}],"name":"tranferDirect","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"keyOf","outputs":[{"name":"","type":"bytes"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}]);
var contractInstanceAddress = fs.readFileSync("WanchainStamps.addr","utf8");
var contractInstance = privacyContract.at(contractInstanceAddress);

var config_privatekey = 'a4369e77024c2ade4994a9345af5c47598c7cfb36c65e8a4a3117519883d9014';
var config_address = '0x2d0e7c0813a51d3bd1d08246af2a8a7a57d8922e';

let stampType = {
    TypeOne:0,
    TypeTwo:1,
    TypeFour:2,
    TypeEight:3,
    TypeSixteen:4
}



function getTransactionReceipt(txHash)
{
    return new Promise(function(success,fail){
        let filter = web3.eth.filter('latest');
        let blockAfter = 0;
        filter.watch(function(err,blockhash){
            if(err ){
                console.log("err:"+err);
            }else{
                let receipt = web3.eth.getTransactionReceipt(txHash);
                blockAfter += 1;
                if(receipt){
                    filter.stopWatching();
                    success(receipt);
                    return receipt;
                }else if(blockAfter > 6){
                    fail("Get receipt timeout");
				}
            }
        });
    });
}




async function i_buyWanchainStamp(type, otaAddress,  otaKeyBytes,  senderPrivateKey){

    var privateKey = new Buffer(senderPrivateKey, 'hex');//from.so_privatekey
    var serial = '0x' + web3.eth.getTransactionCount(config_address).toString(16);
    let payload = contractInstance.buyStamp.getData(type, otaAddress,otaKeyBytes);
    var rawTx = {
        Txtype: '0x0',
        nonce: serial,
        gasPrice: '0x88745',
        gasLimit: '0x1000000',
        to: contractInstanceAddress,//contract address
        value: '0x00',
        data: payload
    };
    console.log("payload: " + rawTx.data);

    var tx = new Tx(rawTx);
    tx.sign(privateKey);
    var serializedTx = tx.serialize();
    let hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
    console.log("serializeTx" + serializedTx.toString('hex'));
    console.log('tx hash:'+hash);
    try {
        let receipt = await getTransactionReceipt(hash);
    }catch(e){
        console.log(e);
    }
    console.log(receipt);
}



async function main(){

    /*
        1. generate a one time Key and compute corresponding private key
    */
    var pubkeyStr = ethUtil.publicKeyFromPrivateKey(config_privatekey);
    var ota = ethUtil.generateOTAPublicKey(pubkeyStr, pubkeyStr);
    var bufOTAPrivate = ethUtil.computeOTAPrivateKey(ota.OtaA1, ota.OtaS1, config_privatekey,config_privatekey);
    var otaKeyBytesCompressed = ethUtil.pubkeyStrCompressed(ota.OtaA1) + ethUtil.pubkeyStrCompressed(ota.OtaS1).slice(2);
    var otaAddress = ethUtil.bufferToHex(ethUtil.publicToAddress('0x' + ota.OtaA1));

    /*
        2. buy the wanchain stamp
     */
    await i_buyWanchainStamp(stampType.TypeTwo, otaAddress, otaKeyBytesCompressed, ethUtil.bufferToHex(bufOTAPrivate).slice(2));

//check the balance of otaDestAddress
}

main();


