## What does this project do?
This project is the barebones of a Chess app that stores its board state via the blockchain.
It can create new chess games, with multiple participants, creating the contract under the address that calls the new game function.
The front-end provides the interactive chessboard (using ChessGround and chess.js), the blockchain provides the storage and turn functionality.

It is missing rules functionality, and currently accepts any FEN string, further extensions would explore this, perhaps with rules onto the blockchain, either directly via solidity or via an oracle node.

## Demonstration video
Located in the root directory named chess_demonstration.mp4

## Directory Structure
- Base directory (truffle project), readme
    - assorted readme files/design choices
    - truffle-config
    - .gitignore
- app (front-end)
    - src (source)
- contracts (solidity contracts)
- migrations (truffle migrations)
- test (solidity contract tests)
- chess_demonstration.mp4 (demonstration video)

## How to run locally
Run an npm install
`npm install`
Run ganache from the base directory
`ganache-cli`
Then run a truffle migrate to compile/deploy to local ganache
`truffle compile`
`truffle migrate`

CD into the app directory for the front-end
`cd app`
Run an npm install 
`npm install`
Then start the react front-end
`npm start`

This should start the front-end on https://localhost:3000

Use metamask to interact with the front-end.

## Tech Stack
- Solidity Smart Contracts
    - Open zeppelin libraries
- Truffle framework
- React (CRA) front-end
    - Drizzle for responsive behaviour


## Library
Uses Ownable from openzeppelin

## Tests
Tests were written to cover as much functionality as required, as well as bad paths for key functions (e.g. The wrong user trying to make their turn, or someone trying to kill the contract)