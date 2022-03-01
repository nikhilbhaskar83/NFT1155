// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract VideoNFT is Ownable, ERC1155 {
    // Base URI
    string private baseURI;
    string public name;
    using ECDSA for bytes32;

    constructor()
        ERC1155(
            'ipfs://QmY5s22q8JAxUzXjsgppB2e5BgZ6bG8vTnv33b3rxDTtUY/{id}.json'
        )
    {
        setName('Test Video Collection');
    }

    function setURI(string memory _newuri) public onlyOwner {
        _setURI(_newuri);
    }

    function setName(string memory _name) public onlyOwner {
        name = _name;
    }

    function mintBatch(uint256[] memory ids)
        public
        onlyOwner
        payable
    {
        uint256[] memory amounts;
        for (uint256 i = 0; i < ids.length; i++) {
            amounts[i] = 1;
        }
        _mintBatch(msg.sender, ids, amounts, '');
    }

    function mint(uint256 id,bytes memory signature) public onlyOwner payable {
        require(isSignatureValid(signature) == true, "Invalid Signature");
        require(id <= 10000 || id == 0, "Token Id should be in the range 0 < x <= 10000");
        _mint(msg.sender, id, 1, '');
    }

    function isSignatureValid(bytes memory _signature)
        public
        view
        returns ( bool)
    {
        bytes32 messagehash = keccak256(
            abi.encodePacked('123456')
        );
        address signer = messagehash.toEthSignedMessageHash().recover(
            _signature
        );

        if (owner() == signer) {
            return true;
        } else {
            return false;
        }
    }
}
