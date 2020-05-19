pragma solidity 0.6.8;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";

contract NFTManager is OwnableUpgradeSafe {
    // @notice Transfer specified NFT to 
    function sendNFT(IERC721 nftContract, uint tokenId, address recipient) external {
        nftContract.transferFrom(address(this), recipient, tokenId);
    }
}