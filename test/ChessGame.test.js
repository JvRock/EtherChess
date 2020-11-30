const ChessGame = artifacts.require("./ChessGame.sol");

contract("ChessGame", accounts => {
  it('Should initialize a chessGame contract with correctly initialised variables', async () => {
    const chessGame = await ChessGame.deployed();
    assert.equal(await chessGame.blockFactor.call(), 50);
  });
});