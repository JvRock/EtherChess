pragma solidity >=0.4.22 <0.8.0;

import './ChessGame.sol';

contract GameCreator {

    //Would not be implemented in "live" as this would get too large if the app became popular
    //Could be replaced with a database, or with people recording their own games
    address[] public games;
    
    function newGame(address[] memory _players, uint _blockFactor) public returns(address newContract) {
        ChessGame chessGame = new ChessGame(_players, _blockFactor);
        games.push(address(chessGame));
        return address(chessGame);
    }

    function getGamesSize() public view returns (uint size){
        return games.length;
    }

}