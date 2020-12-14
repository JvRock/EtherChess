pragma solidity >=0.4.22 <0.8.0;

import './ChessGame.sol';
/// @title A contract that initialises new ChessGames, giving users their own chess game
/// @author Jaan Smith
contract GameCreator {

    ///Would not be implemented in "live" as this would get too large if the app became popular
    ///Could be replaced with a database, or with people recording their own game's addresses to plug into the app
    address[] public games;
    ///This exists only as a source to retrieve the latest game, incase a user forgets their latest address
    mapping(address => address) public latestGame;

    /// @author Jaan Smith
    /// @notice Creates a new game, initialising new contracts for the chess game, and a new board state
    /// @dev too expensive to do in live, needs to be optimised or looked at for a cheaper option. (Costs 200k+ gas!)
    /// @param _whitePlayers is an array of addresses representing the players for the white pieces 
    /// @param _blackPlayers is an array of addresses representing the players for the black pieces
    /// @param _blockFactor represents the amount of blocks that can pass before timing a team out
    /// @return newContract - the address of the new ChessGame contract owned by the msg.sender
    function newGame(address[] memory _whitePlayers, address[] memory _blackPlayers, uint _blockFactor) public returns(address newContract) {
        ChessGame chessGame = new ChessGame(_whitePlayers, _blackPlayers, _blockFactor);
        games.push(address(chessGame));
        latestGame[msg.sender] = address(chessGame);
        return address(chessGame);
    }


    /// @author Jaan Smith
    /// @notice Returns the current size of the games variable
    /// @dev probably converted to a uint in a vinal build just to track new games, instead of tracking the existing array
    /// @return size of the games array
    function getGamesSize() public view returns (uint size){
        return games.length;
    }

}