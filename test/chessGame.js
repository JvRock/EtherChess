const ChessGame = artifacts.require("./ChessGame.sol");

contract("ChessGame", accounts => {
  var chessGame;
  before( async () => {
    chessGame = await ChessGame.deployed();
  });

  it('Should initialize a chessGame contract with correctly initialised variables', async () => {
    const blockFactor = await chessGame.blockFactor.call();
    const chessFEN = await chessGame.getBoardState.call();
    assert.equal(blockFactor.words[0], 50);
    assert.equal(chessFEN, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  });

  it('Should be able to vote', async () => {
    await chessGame.voteTurn(
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
      {from: accounts[0]}
    );

  });

});