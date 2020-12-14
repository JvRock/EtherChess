
pragma solidity >=0.4.22 <0.8.0;

import './GameEngine.sol';
import './BoardState.sol';

/// @title A Class representing a chess game
/// @author Jaan Smith
/// @notice This class does not implement all chess functionality, currently an unoptimised Stub
/// @dev A lot of the basic functionality of chess is missing here, 
/// experimentation required to see if this can be done on chain, perhaps oracle nodes instead?
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


/// @author Jaan Smith
/// @notice Constructor for the ChessGame contract
/// Maximum 4 players per team, initialises external contracts
/// @param _whitePlayers is an array of addresses representing the players for the white pieces
/// @param _blackPlayers is an array of addresses representing the players for the black pieces
/// @param _blockFactor represents the amount of blocks that can pass before timing a team out
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

    /// @author Jaan Smith
    /// @notice Returns the object representing the current team's players
    /// @dev May be some bugs lurking in this to do with block validation
    /// @return A string representing which colour's turn it is, and The array containing the current team's players whos turn it is
    function getCurrentTeamsPlayers() public view returns(string memory turnString, address[] memory players)
    {
        if(turn == false) return ( "White", whitePlayers );
        else return ( "Black", blackPlayers );
    }

    /// @author Jaan Smith
    /// @notice Populates the address->boolean mapping with the address of a particular team
    /// @param players is a supplied array of addresses representing the team's players
    /// @param teamFlag is a boolean representing the team, white = false, black = true
    function populateTeamMapping(address[] memory players, bool teamFlag) internal {
        for(uint i = 0; i < players.length; i++) {
            team[players[i]] = teamFlag;
        }
    }
    
    /// @author Jaan Smith
    /// @notice Internal function used to change game state to finished
    function gameOver() internal {
        isGameOver = true;
    }

    /// @author Jaan Smith
    /// @notice Provides a proposed move from a particular address, also triggers end of turn and other logic
    /// Depending on the state of other variables (e.g. can end a turn based on total votes, or block time)
    /// @param _proposedMove is the FEN representation of the new board state should this turn become validated
    /// @dev currently takes any string as on-chain validation is an extension that was not implemented
    function voteTurn(string memory _proposedMove) public {

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

    /// @author Jaan Smith
    /// @notice Internal function for checking if the chess turn should be ended
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

    /// @author Jaan Smith
    /// @notice Chooses a random turn from the list of proposed turns, changes board state, switches teams
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

    /// @author Jaan Smith
    /// @notice Returns the FEN representation of the current chess board, from an external contract
    /// @return FEN string of the board state
    function getBoardState() public view returns (string memory FEN) {
        return boardState.FEN();
    }

}