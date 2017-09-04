pragma solidity ^0.4.0;

//the contract is for develop poc
//
contract WanchainStamps {
    //gas cost for stamps
    //ws =
    // 0 means  never in
    // design the stamp value is 1,2,4,8,16,32,64,128
    // that mean 2**0 2**1 .... 2**7
    // there is only one stamp in a transaction.
    // when estimateStampLimit, we return these value too.
    // mapping (address => uint) public oneWs;
    // mapping (address => uint) public twoWs;

    // mapping (address => bytes) keys4Stamp;
    uint public stampPrice = 1000; //
    mapping (address => bytes) public StampListOne;
    mapping (address => bytes) public StampListTwo;
    mapping (address => bytes) public StampListFour;
    mapping (address => bytes) public StampListEight;
    mapping (address => bytes) public StampListSixteen;
    stampType public lastStampType = stampType.TypeTwo;
    enum stampType {
        TypeOne,
        TypeTwo,
        TypeFour,
        TypeEight,
        TypeSixteen
    }
    function setStampPrice(uint price) {
        stampPrice = price;
    }



    function typeValid(stampType _type) internal returns (bool){
        if(_type == stampType.TypeOne || _type == stampType.TypeTwo || _type == stampType.TypeFour
         || _type == stampType.TypeEight || _type == stampType.TypeSixteen){
            return true;
        } else{
            return false;
        }
    }


    function buyStamp(stampType _type, address otaAddress, bytes otaPubKey)
            payable
            public
    {
        require (typeValid(_type));

        if (_type == stampType.TypeOne ){
            require (msg.value == 1 * stampPrice);
            StampListOne[otaAddress] = otaPubKey;
        }
        else if (_type == stampType.TypeTwo ){
            require (msg.value == 2 * stampPrice);
            StampListTwo[otaAddress] = otaPubKey;
        }
        else if (_type == stampType.TypeFour ){
            require (msg.value == 4 * stampPrice);
            StampListFour[otaAddress] = otaPubKey;
        }
        else if (_type == stampType.TypeEight ){
            require (msg.value == 8 * stampPrice);
            StampListEight[otaAddress] = otaPubKey;
        }
        else if (_type == stampType.TypeSixteen ){
            require (msg.value == 16 * stampPrice);
            StampListSixteen[otaAddress] = otaPubKey;
        }
    }

/*
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
*/
}
