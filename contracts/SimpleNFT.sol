// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 Live Code: Colecionável (NFT)
 Data: 03 de Abril de 2022
 Objetivos: 
  - criar um contrato simples de um colecionável;
  - fazer o deploy na Rinkeby, testnet da Ethereum;
  - verificar o contrato no Etherscan;
  - utilizar a interface do Etherscan para interagir com o contrato;
  - utilizar a api do OpenSea para verifiacar se o metadado está correto;
  - ver a coleção e os NFTs no OpenSea (testnet);
  Rinkeby: https://rinkeby.etherscan.io/address/0x22a0fAF00d685fC4ea78Be5F29092cE2fDfB4400
  OpenSea: https://testnets.opensea.io/collection/nft-brcwefueyt
 */

contract SimpleNFT is Ownable, ERC721 {
  using Counters for Counters.Counter;
  using Strings for uint256;

  Counters.Counter private _mintedSupply;

  uint256 immutable MAX_SUPPLY;
  uint256 immutable MAX_PER_TRANSACTION;
  uint256 immutable TOKEN_PRICE;
  string public baseURI;
  bool public paused;
  bool public freezeMetadata;


  constructor(
    string memory baseURI_
    ) 
    ERC721("SimpleNFT", "SNFT")
    {
    MAX_SUPPLY = 1000;
    MAX_PER_TRANSACTION = 3;
    TOKEN_PRICE = 0.0001 ether;
    paused = true;
    baseURI = baseURI_;
  }

  function totalSupply() external view returns (uint256){
    return _mintedSupply.current();
  }

  function mint(uint256 _amount) external payable {
    require(!paused, "Please wait until unpaused");
    require(msg.value == TOKEN_PRICE * _amount, "Incorrect ether amount");
    require(_amount > 0, "Mint at least one");
    require(_amount <= MAX_PER_TRANSACTION, "Max 3 allowed");
    require(_mintedSupply.current() + _amount <= MAX_SUPPLY, "Not enough tokens left to mint");

    for(uint256 i = 1; i <= _amount; i++){
      _mintedSupply.increment();
      _safeMint(msg.sender, _mintedSupply.current());
    }
  }

   function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
      require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
      string memory baseURI_ = _baseURI();
      return string(abi.encodePacked(baseURI_, tokenId.toString(), ".json"));
    }


  function setPause(bool _pauseValue) external onlyOwner {
    paused = _pauseValue;
  }

  function setFreezeMetadata() external onlyOwner {
    freezeMetadata = true;
  }

  function setBaseURI(string calldata baseURI_) external onlyOwner {
    require(!freezeMetadata, "Metadata Freezed");
    baseURI = baseURI_;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }
}