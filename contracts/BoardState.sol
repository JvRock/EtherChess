// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title The board state to be used by the ChessGame contract to store FEN states
/// @author Jaan Smith
/// @notice Does not enforce any valid positions
contract BoardState is Ownable {
    //A list of all moves played
    string[] public history;
    //Current Board State
    string public FEN;
    //Address of contract that can update the board state
    address Owner;


    /// @author Jaan Smith
    /// @notice Constructor initialises the standard starting FEN of chess
    constructor () public {
        FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }

    /// @author Jaan Smith
    /// @notice Sets the current FEN to the new state, also pushes the new state to the address containing the history of FENs
    /// @dev Very possible this is too expensive for long games, history probably should be optimised or removed. Perhaps emitted as a log event instead?
    /// @return _FEN, the new board state
    function newBoardState(string memory _FEN) onlyOwner public returns (string memory) {
        history.push(_FEN);
        FEN = _FEN;
    }
}
