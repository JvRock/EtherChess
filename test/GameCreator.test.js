const GameCreator = artifacts.require("./GameCreator.sol");

contract("GameCreator", accounts => {
  it('Should initialize a game creator and create a game', async () => {
    const gameCreator = await GameCreator.deployed();

    await gameCreator.newGame([accounts[0], accounts[1]], 50,{ from: accounts[0] });

    const size = await gameCreator.getGamesSize.call();
    assert.equal(size, 1);
  });
});