const BoardState = artifacts.require("./BoardState.sol");
const startFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const FEN1 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
const FEN2 = 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2';

contract("BoardState", accounts => {
    var boardState;
    before( async() => {
        boardState = await BoardState.new();
    });

    it('Should have correctly set initial starting position FEN', async () => {
        assert.equal(startFEN, await boardState.FEN());
    });

    it('Should be able to update FEN with new board state', async () => {
        await boardState.newBoardState(FEN1, {from: accounts[0]});
        assert.equal(FEN1, await boardState.FEN());
    });

    it('Only owner should be able to update FEN with new board state', async () => {
        try {
            await boardState.newBoardState(FEN2, {from: accounts[1]});
            assert(false, "Reached assertion that should not be reached");
        } catch(error) {
            assert.equal(error.reason, "Ownable: caller is not the owner");
        }
    });

    it('History variable gets added to on newBoardState', async () => {
        try {
            await boardState.history(1);
            assert(false, "Reached assertion that should not be reached");
        } catch(error) {
            var errorStr = error.toString();
            assert.equal(errorStr, 'Error: Returned error: VM Exception while processing transaction: invalid opcode');
        }
        await boardState.newBoardState(FEN2, {from: accounts[0]});
        assert.equal(await boardState.history(1), FEN2);
    });
});
