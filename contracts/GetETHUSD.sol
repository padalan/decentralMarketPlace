pragma solidity ^0.5.0;


// Renamed https://github.com/oraclize/ethereum-api/blob/master/oraclizeAPI_0.5.sol to
// installed_contracts/oraclize-api/contracts/usingOraclize.sol
import "installed_contracts/oraclize-api/contracts/usingOraclize.sol";

contract GetETHUSD is usingOraclize {

    string public ETHgas;
    string public ETHprice;

    event LogInfo(string description);
    event LogPrice(string price);
    event LogGas(string price);

    enum oraclizeState { _price, _gas }

    struct oraclizeCallback
    {
        oraclizeState _state;
    }

    mapping (bytes32 => oraclizeCallback) public oraclizeCallbacks;

    constructor() public payable
    {
        // Replace the next line with what we see in the ethereum-bridge console
        OAR = OraclizeAddrResolverI(0x14D72081EaFb56E80341108ff8045b8fBd250471);
        getPriceDetails();
        getGasDetails();
    }

    function __callback(bytes32 myid, string memory result) public
    {
        require (msg.sender == oraclize_cbAddress());
        oraclizeCallback memory o = oraclizeCallbacks[myid];
        if (o._state == oraclizeState._price) {
            ETHprice = result;
            emit LogPrice(ETHprice);
            getPriceDetails();

        } else if (o._state == oraclizeState._gas) {
            ETHgas = result;
            emit LogGas(ETHgas);
            getGasDetails();
        }
    }
    function getPriceDetails() public payable
    {
        emit LogInfo("Oraclize query...");
        bytes32 queryId = oraclize_query("URL", "json(https://api.etherscan.io/api?module=stats&action=ethprice).result.ethusd");
        oraclizeCallbacks[queryId] = oraclizeCallback(oraclizeState._price);
    }

    function getGasDetails() public payable
    {
        emit LogInfo("Oraclize query...");
        bytes32 queryId = oraclize_query("URL", "json(https://ethgasstation.info/json/ethgasAPI.json).average");
        oraclizeCallbacks[queryId] = oraclizeCallback(oraclizeState._gas);
    }
}
