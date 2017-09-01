pragma solidity ^0.4.0;

//the contract is for develop poc
//
contract WanchainStamps {
    //gas cost for stamps
    //ws = 
    // 0 means  never in
    uint64 public stampPrice; //
    // design the stamp value is 1,2,4,8,16,32,64,128
    // that mean 2**0 2**1 .... 2**7
    // there is only one stamp in a transaction.
    // when estimateStampLimit, we return these value too.
    mapping (address => uint) public oneWs;
    mapping (address => uint) public twoWs;

    mapping (address => bytes) keys4Stamp;

    function buyStamp(address otaAddress, bytes otaPubKey) returns (string){
        if (msg.value == 0.005 ether) {
            if(oneWs[otaAddress] == 0){
                oneWs[otaAddress] = 1;
                keys4Stamp[otaAddress] = otaPubKey;
                return 'success';
            }
        }
        return 'failed';
    }
}
