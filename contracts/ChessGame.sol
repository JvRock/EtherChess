
pragma solidity >=0.4.22 <0.8.0;

import './GameEngine.sol';
import './BoardState.sol';

contract ChessGame {

    BoardState boardState;
    GameEngine gameEngine;

    //A list of players. Odd numbers are black, even numbers are white.
    address[] public players;

    //Mapping of which team an address is on
    //False = White, True = Black
    mapping(address => bool) public team;
    //Time limit on each move, measured in block height (Making this an estimate)
    uint public blockFactor;
    //False = White, True = Black
    bool public turn;
    bool public isGameOver;
    bool public winner;
    uint public lastMove;
    
    uint numberOfMoves;

    //Proposed Moves
    mapping(address => string) proposedMoves;

    constructor (address[] memory _players, uint _blockFactor) public {
        players = _players;
        blockFactor = _blockFactor;
        turn = false;
        isGameOver = false;
        winner = false;
        lastMove = block.number;
        gameEngine = new GameEngine();
        boardState = new BoardState();
    }
    
    function gameOver() internal {
        isGameOver = true;
    }

    function voteTurn(string memory _proposedMove) public {
        //TODO Require only participants (and the correct team) to be able to vote

        require(isGameOver == false, "Game is over, no more voting for turns");
        require(team[msg.sender] == turn, "Not your turn, sorry" ); // TODO  - Logic that says OR time has expired
        if(lastMove + blockFactor <= block.number && numberOfMoves == 0) {
            gameOver();
            winner = !turn;
        }
        require(gameEngine.evaluateMove(_proposedMove) == true);
        proposedMoves[msg.sender] = _proposedMove;
    }

    function getBoardState() public view returns (string memory FEN) {
        return boardState.FEN();
    }

}