pragma solidity 0.6.8;

import IERC721 from "@openzeppelin/contracts-ethereum-package/token/ERC721/IERC721.sol"
import Ownable from "@openzeppelin/contracts-ethereum-package/access/Ownable.sol"

contract NFTManager is Ownable {
    // @notice Transfer specified NFT to 
    function sendNFT(IERC721 nftContract, uint tokenId, address recipient) external {
        nftContract.transferFrom(address(this), recipient, tokenId);
    }
}