const ChessGame = artifacts.require("./ChessGame.sol");

const startFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const FEN1 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
const FEN2 = 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2';

contract("ChessGame", accounts => {
  var chessGame;
  before( async () => {
    chessGame = await ChessGame.deployed();
  });

  it('Should initialize a chessGame contract with correctly initialised variables', async () => {
    const blockFactor = await chessGame.blockFactor.call();
    const chessFEN = await chessGame.getBoardState.call();
    assert.equal(blockFactor.words[0], 50);
    assert.equal(chessFEN, startFEN)
  });

  it('Should return the correct team players', async () => {
    assert.equal(await chessGame.blackPlayers.call(0), accounts[1]);
    assert.equal(await chessGame.whitePlayers.call(0), accounts[0]);
  })

  it('Should be able to vote, but not if its not your turn', async () => {
    await chessGame.voteTurn(
      FEN1,
      {from: accounts[0]}
    );

    try { 
      await chessGame.voteTurn(
        FEN2,
      {
        from: accounts[0]
      })
      assert(false, "Was supposed to throw before this");
    } catch (error) {
      assert.equal(error.reason, "Not your turn, sorry");
    }

    await chessGame.voteTurn(
      FEN2,
      {
        from: accounts[1]
      })
      assert.equal(await chessGame.getBoardState(), FEN2);
  });

  it('Should switch turns correctly after 1 vote in a 1v1', async () => {
    await chessGame.voteTurn(
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
      {from: accounts[0]}
    );
    var turn = await chessGame.turn.call();
    assert.equal(turn, true);
  });

  it('Should fail to deploy a chess game with more than 4 players', async () => {
    var fiveAddresses = [];
    for(var i = 0; i < 5; i++) {
      fiveAddresses.push(accounts[i]);
    }
    try {
      await ChessGame.new(fiveAddresses, [accounts[5]], 50);
      assert(false, "Was supposed to throw before this");
    } catch(error) {
      assert.equal(error.reason, "Maximum 4 players each team");
    }
  });
});