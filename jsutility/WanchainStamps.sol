pragma solidity ^0.4.0;

//the contract is for develop poc
//
contract WanchainStamps {
    //gas cost for stamps
    //ws = 
    // 0 means  never in 
    mapping (address => uint) oneWs;
    mapping (address => uint) twoWs;

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
