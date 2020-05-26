pragma solidity 0.6.8;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";

contract NFTManagerUpgradeSafe is OwnableUpgradeSafe {
    function initialize() public initializer {
        __Ownable_init();
    }

    // @notice Transfer specified NFT to 
    function sendNFT(address recipient, IERC721 nftContract, uint tokenId) external {
        nftContract.transferFrom(address(this), recipient, tokenId);
    }
}