pragma solidity >=0.4.22 <0.8.0;

/// @title Move evaluator
/// @author Jaan Smith
/// @notice A stub contract that would usually evaluate proposed moves and allow/disallow them
/// @dev At this point this simply evaluates to true allowing illegal moves
/// the front-end disallows incorrect moves, but this can easily be bypassed
contract GameEngine {
    function evaluateMove(string memory _FEN) public payable returns (bool) {
        return true;
    }
}
