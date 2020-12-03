
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
    //Count of votes
    uint voteCount;

    constructor (address[] memory _players, uint _blockFactor) public {
        require(players.length < 8, "Maximum 8 players total");
        players = _players;
        blockFactor = _blockFactor;
        turn = false;
        isGameOver = false;
        winner = false;
        lastMove = block.number;
        gameEngine = new GameEngine();
        boardState = new BoardState();
        voteCount = 0;
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
        voteCount++;
        isTurnOver();
    }

    function isTurnOver() internal {
        if(voteCount >= (players.length+1)/2) {
            makeTurn();
        }
    }

    //Chooses a random person's move, sets board state.
    function makeTurn() internal {
        uint start;
        if(turn == false) {
            start = 0;
        } else {
            start = 1;
        }
        string[] memory vote = new string[]((voteCount+1)/2);
        uint counter = 0;
       for(uint i = start; i < (voteCount+start)*2; i=i+2) {
            vote[counter] = proposedMoves[players[i]];
            proposedMoves[players[i]] = "";
            counter++;
        }
         uint randomNumber;
        if(voteCount == 1) {
            randomNumber = 0;
        } else {
            randomNumber = uint(keccak256(abi.encodePacked(blockhash(block.number-1)))) % voteCount;
        }
        boardState.newBoardState(vote[randomNumber]);
        voteCount = 0;
    }

    function getBoardState() public view returns (string memory FEN) {
        return boardState.FEN();
    }

}