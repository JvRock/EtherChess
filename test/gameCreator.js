const GameCreator = artifacts.require("./GameCreator.sol");

contract("GameCreator", accounts => {
  var gameCreator;

  before( async () => {
    gameCreator = await GameCreator.deployed();
  });

  it('Should initialize a game creator with correct constructor variables', async () => {
    await gameCreator.newGame([accounts[0]],[accounts[1]], 50,{ from: accounts[0] });
    const contract = await gameCreator.latestGame.call(accounts[0]);
    assert(contract != "0x0000000000000000000000000000000000000000");
    assert.equal(contract.length, 42);
  });

  it('Should be able to get the games size', async () => {
    assert.equal(await gameCreator.getGamesSize.call(), 1);
    await gameCreator.newGame([accounts[0]],[accounts[1]], 50,{ from: accounts[0] });
    assert.equal(await gameCreator.getGamesSize.call(), 2);
  });

  it('Updates latest game when newGame is triggered', async () => {
    var latestGame = await gameCreator.latestGame(accounts[0]);
    await gameCreator.newGame([accounts[0]],[accounts[1]], 50,{ from: accounts[0] });
    assert.notEqual(latestGame,await gameCreator.latestGame(accounts[0])); 
  });
  

  it('Should deactivate on circuit breaker function', async () => {
    await gameCreator.toggleActive({ from: accounts[0]} );
    try {
      await gameCreator.newGame([accounts[0]],[accounts[1]], 50,{ from: accounts[0] });
      assert(false, "Reached assertion that should not be reached");
    } catch(error) {
      assert.equal(error.reason, "Contract is stopped");
    }
  });

  it('Non-owner should not be able to trigger circuit breaker', async () => {
    try {
      await gameCreator.toggleActive({ from: accounts[1]} );
      assert(false, "Reached assertion that should not be reached");
    } catch(error) {
      assert.equal(error.reason, "Ownable: caller is not the owner");
    }
  });
});