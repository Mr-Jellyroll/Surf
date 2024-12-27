// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SurfForCF is ERC721, Pausable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Fundraising goal and amount raised
    uint256 public goalAmount;
    uint256 public totalRaised;

    // Minimum donation amount to receive an NFT
    uint256 public constant MINIMUM_DONATION = 0.01 ether;

    // Mapping to store donation amounts for each contributor
    mapping(address => uint256) public contributions;

    // Base URI for NFT metadata
    string private _baseTokenURI;

    // Events
    event DonationReceived(address indexed donor, uint256 amount, uint256 tokenId);
    event GoalUpdated(uint256 newGoal);
    event FundsWithdrawn(address indexed beneficiary, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        uint256 _goalAmount,
        string memory baseURI
    ) ERC721(name, symbol) {
        goalAmount = _goalAmount;
        _baseTokenURI = baseURI;
    }

    function donate() public payable whenNotPaused {
        require(msg.value >= MINIMUM_DONATION, "Donation below minimum amount");

        // Update contribution tracking
        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;

        // Mint NFT for donor
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);

        emit DonationReceived(msg.sender, msg.value, newTokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function updateGoal(uint256 newGoal) external onlyOwner {
        goalAmount = newGoal;
        emit GoalUpdated(newGoal);
    }

    function withdrawFunds(address payable beneficiary) external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool sent, ) = beneficiary.call{value: balance}("");
        require(sent, "Failed to send funds");

        emit FundsWithdrawn(beneficiary, balance);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // View functions
    function getDonorContribution(address donor) external view returns (uint256) {
        return contributions[donor];
    }

    function getProgress() external view returns (uint256, uint256) {
        return (totalRaised, goalAmount);
    }
}