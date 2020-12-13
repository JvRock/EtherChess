
pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;

import './GameEngine.sol';
import './BoardState.sol';

contract ChessGame {

    BoardState boardState;
    GameEngine gameEngine;

    //A list of players. Odd numbers are black, even numbers are white.
    address[] public whitePlayers;
    address[] public blackPlayers;

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

    constructor (address[] memory _whitePlayers, address[] memory _blackPlayers, uint _blockFactor) public {
        require(_whitePlayers.length < 4, "Maximum 4 players each team");
        require(_blackPlayers.length < 4, "Maximum 4 players each team");
        whitePlayers = _whitePlayers;
        blackPlayers = _blackPlayers;
        blockFactor = _blockFactor;
        turn = false;
        isGameOver = false;
        winner = false;
        lastMove = block.number;
        gameEngine = new GameEngine();
        boardState = new BoardState();
        voteCount = 0;
        populateTeamMapping(whitePlayers, false);
        populateTeamMapping(blackPlayers, true);


    }

    function getCurrentTeamsPlayers() public view returns(string memory turnString, address[] memory players)
    {
        if(turn == false) return ( "White", whitePlayers );
        else return ( "Black", blackPlayers );
    }

    function populateTeamMapping(address[] memory players, bool teamFlag) internal {
        for(uint i = 0; i < players.length; i++) {
            team[players[i]] = teamFlag;
        }
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
        uint playerCount;
        if(turn) {
            playerCount = blackPlayers.length;
        }
        else {
            playerCount = whitePlayers.length;
        }

        if(voteCount >= playerCount) {
            makeTurn();
        }
    }

    //Chooses a random person's move, sets board state.
    function makeTurn() internal {
        uint start;
        address[] memory playersArray;
        if(turn == false) {
            playersArray = whitePlayers;
        } else {
            playersArray = blackPlayers;
        }
        string[] memory votes = new string[](voteCount+1);
        uint counter = 0;
        for(uint i = start; i < voteCount; i++) {
            votes[counter] = proposedMoves[playersArray[i]];
            proposedMoves[playersArray[i]] = "";
            counter++;
        }
        uint randomNumber;
        if(voteCount == 1) {
            randomNumber = 0;
        } else {
            randomNumber = uint(keccak256(abi.encodePacked(blockhash(block.number-1)))) % voteCount;
        }
        boardState.newBoardState(votes[randomNumber]);
        voteCount = 0;
        turn = !turn;
    }

    function getBoardState() public view returns (string memory FEN) {
        return boardState.FEN();
    }

}