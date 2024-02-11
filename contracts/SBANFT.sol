// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SBANFT is ERC721 {
    constructor() ERC721("SBANFT", "NFT") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg";
    }
}
