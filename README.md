## What does this project do?
This project is the barebones of a Chess app that stores its board state via the blockchain.
It can create new chess games, with multiple participants, creating the contract under the address that calls the new game function.
The front-end provides the interactive chessboard (using ChessGround and chess.js), the blockchain provides the storage and turn functionality.
A chess engine would ideally be put onto the blockchain, either directly via solidity, or perhaps via an oracle node due to gas costs.

## How to run locally
Run truffle from the base directory
`truffle develop`
Then run a truffle migrate to compile/deploy to local ganache
`truffle migrate`

CD into the app directory for the front-end
`cd app`
Then start the react front-end
`npm start`

This should start the front-end on https://localhost:3000