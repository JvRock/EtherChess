# Design decisions

## Restricting Access

I've used the common library from openzepplin `ownable()` in order to restrict access as a pattern for any functions that should be restricted.
For exampke the game creator function can only be killed or circuit broke by the owner.
When the game creator creates a new chessgame, only the Contract can set the game state using `onlyOwner` too.

## Circuit Breaker

I used a circruit breaker pattern for general administration incase I wished to stop ChessGames from being created for any reason. This exists in the GameCreator contract.