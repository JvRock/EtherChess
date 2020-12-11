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

  it('Should be able to vote, but not if its not your turn', async () => {
    console.log(await chessGame.turn.call());
    await chessGame.voteTurn(
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
      {from: accounts[0]}
    );
    console.log(await chessGame.turn.call());

    try { await chessGame.voteTurn(
      "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
      {
        from: accounts[0]
      })
    } catch (error) {
      console.log(error.reason);
      assert.equal(error.reason, "Not your turn, sorry");
    }
    console.log(await chessGame.turn.call());

    await chessGame.voteTurn(
      "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
      {
        from: accounts[1]
      })
  });
  

});