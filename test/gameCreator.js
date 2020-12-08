const GameCreator = artifacts.require("./GameCreator.sol");

contract("GameCreator", accounts => {
  it('Should initialize a game creator and create a game', async () => {
    const gameCreator = await GameCreator.deployed();
    const tx = await gameCreator.newGame([accounts[0]],[accounts[1]], 50,{ from: accounts[0] });
    const size = await gameCreator.getGamesSize.call();
    const contract = await gameCreator.latestGame.call(accounts[0]);
    assert(contract != "0x0000000000000000000000000000000000000000");
    assert.equal(contract.length, 42);
    assert.equal(size, 1);
  });
});