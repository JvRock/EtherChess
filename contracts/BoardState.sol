// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/access/Ownable.sol";

contract BoardState is Ownable {
    //A list of all moves played
    string[] public history;
    //Current Board State
    string public FEN;
    //Address of contract that can update the board state
    address Owner;

    constructor () public {
        FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }

    function newBoardState(string memory _FEN) onlyOwner public returns (string memory) {
        history.push(_FEN);
        FEN = _FEN;
    }
}
