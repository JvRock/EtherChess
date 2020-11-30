const GameCreator = artifacts.require("./GameCreator.sol");
const ChessGame = artifacts.require("./ChessGame.sol");

module.exports = function(deployer, network, accounts) {
    if(network == "develop") {
        deployer.deploy(ChessGame, [accounts[0], accounts[1]], 50);
    }
    deployer.deploy(GameCreator);
};