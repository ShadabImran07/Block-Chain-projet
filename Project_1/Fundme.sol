// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error notOwner();

contract Fundme{
    using PriceConverter for uint256;
    // addres = 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e

    address[] public funders;
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address immutable i_owner;
    mapping(address => uint256) public addresToFund;
    constructor(){
        i_owner = msg.sender;
    }

    function fund() public payable{
        require(msg.value.getConversionRate() >= MINIMUM_USD, "Send More ETH!");
        addresToFund[msg.sender] += msg.value;
        funders.push(msg.sender);

    }

    function getVersion() public view returns (uint256){
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
        return priceFeed.version();
    }

    modifier onlyOwner {
        if(i_owner != msg.sender) revert notOwner();
        _;

    }

    function withdraw() public onlyOwner{
        for(uint256 founderIndex=0;founderIndex<funders.length;founderIndex++){
            address funded = funders[founderIndex];
            addresToFund[funded] = 0;
        }
        funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess,"callFailed!");
    }

    receive() external payable{
        fund();
    }

    fallback() external payable{
        fund();
    }
}