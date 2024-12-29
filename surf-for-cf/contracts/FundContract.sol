// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SurfForCF is ERC721, Ownable {
    uint256 private _tokenIds; // Token ID counter

    uint256 public goalAmount;
    uint256 public totalRaised;
    uint256 public minDonation;
    string public campaignURI;
    bool public isActive;

    mapping(uint256 => uint256) public tokenDonationAmount;
    mapping(address => uint256[]) public donorTokens;

    event DonationReceived(address donor, uint256 amount, uint256 tokenId);
    event CampaignStateChanged(bool isActive);

    constructor(
        string memory name,
        string memory symbol,
        uint256 _goalAmount,
        uint256 _minDonation,
        string memory _campaignURI
    ) ERC721(name, symbol) Ownable(msg.sender) { // Pass msg.sender to Ownable
        goalAmount = _goalAmount;
        minDonation = _minDonation;
        campaignURI = _campaignURI;
        isActive = true;
        _tokenIds = 0; // Initialize token ID counter
    }

    function donate() public payable {
        require(isActive, "Campaign is not active");
        require(msg.value >= minDonation, "Donation below minimum amount");

        totalRaised += msg.value;

        // Increment token ID counter
        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(msg.sender, newTokenId);
        tokenDonationAmount[newTokenId] = msg.value;
        donorTokens[msg.sender].push(newTokenId);

        emit DonationReceived(msg.sender, msg.value, newTokenId);

        if (totalRaised >= goalAmount) {
            isActive = false;
            emit CampaignStateChanged(false);
        }
    }

    function getDonorTokens(address donor) public view returns (uint256[] memory) {
        return donorTokens[donor];
    }

    function getDonationAmount(uint256 tokenId) public view returns (uint256) {
        return tokenDonationAmount[tokenId];
    }

    function toggleCampaignState() public onlyOwner {
        isActive = !isActive;
        emit CampaignStateChanged(isActive);
    }

    function withdraw() public onlyOwner {
        require(address(this).balance > 0, "No funds to withdraw");
        payable(owner()).transfer(address(this).balance);
    }

    function tokenURI(uint256 /* tokenId */) public view override returns (string memory) {
        return campaignURI;
    }
}
