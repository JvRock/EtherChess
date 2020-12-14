## What does this project do?
This project is the barebones of a Chess app that stores its board state via the blockchain.
It can create new chess games, with multiple participants, creating the contract under the address that calls the new game function.
The front-end provides the interactive chessboard (using ChessGround and chess.js), the blockchain provides the storage and turn functionality.
A chess engine would ideally be put onto the blockchain, either directly via solidity, or perhaps via an oracle node due to gas costs.

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

## How to run locally
Run an npm instal
`npm install`
Run truffle from the base directory
`truffle develop`
Then run a truffle migrate to compile/deploy to local ganache
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