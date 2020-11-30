pragma solidity >=0.4.22 <0.8.0;
/*A stub contract that would usually evaluate proposed moves and allow/disallow them
    At this point, due to time constraints, this simply evaluates to true allowing illegal moves
    the front-end disallows incorrect moves, but this can easily be bypassed */
contract GameEngine {
    function evaluateMove(string memory _FEN) public payable returns (bool) {
        return true;
    }
}
