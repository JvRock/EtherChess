pragma solidity >=0.4.22 <0.8.0;

import './ChessGame.sol';

contract GameCreator {

    ///Would not be implemented in "live" as this would get too large if the app became popular
    ///Could be replaced with a database, or with people recording their own game's addresses to plug into the app
    address[] public games;
    ///This exists only as a source to retrieve the latest game, incase a user forgets their latest address
    mapping(address => address) public latestGame;
    
    function newGame(address[] memory _whitePlayers, address[] memory _blackPlayers, uint _blockFactor) public returns(address newContract) {
        ChessGame chessGame = new ChessGame(_whitePlayers, _blackPlayers, _blockFactor);
        games.push(address(chessGame));
        latestGame[msg.sender] = address(chessGame);
        return address(chessGame);
    }

    function getGamesSize() public view returns (uint size){
        return games.length;
    }

}