import React from 'react';
import Chessground from 'react-chessground';
import 'react-chessground/dist/styles/chessground.css';
import Chess from "chess.js"
import json from "../contracts/ChessGame.json"
import {withRouter} from 'react-router-dom';

const chess = new Chess();
class ChessBoard extends React.Component {

  state = { dataKey: null };
  componentDidMount() {
    const { drizzle } = this.props;
    const { address } = this.props.match.params;
    drizzle.addContract({
      contractName: "ChessGame",
      web3Contract: new drizzle.web3.eth.Contract(
        json.abi,
        address
      )
    });
    const contract = drizzle.contracts.ChessGame;

    // let drizzle know we want to watch the `getBoardState` method
    const boardDataKey = contract.methods["getBoardState"].cacheCall();
    const turnDataKey = contract.methods["turn"].cacheCall();
    const playersKey = contract.methods["getCurrentTeamsPlayers"].cacheCall();

    // save the `dataKey` to local component state for later reference
    this.setState({ boardDataKey });
    this.setState({ turnDataKey });
    this.setState({ playersKey });

  }

  chessToGround = (turn) => {
    if(turn === "w") return "white"
    else return "black";
  }

  render() {
    if (this.state.loading || this.props.drizzleState.contracts.ChessGame === undefined) return "Loading Drizzle...";
    else {
      const { ChessGame } = this.props.drizzleState.contracts;
      const FEN = ChessGame.getBoardState[this.state.boardDataKey];
      const players = ChessGame.getCurrentTeamsPlayers[this.state.playersKey];
      if(FEN === undefined || players === undefined) {
        return "Loading board..."
      } else {
        chess.load(FEN.value);
        var viewOnlyFlag = false;
        var turn = players.value[0]
        var turnFragment;
        if(players.value[1].indexOf(this.props.drizzleState.accounts[0]) === -1 ) {
          viewOnlyFlag = true;
          turnFragment = (<h3>Not currently your turn.</h3>)
        } else {
          turnFragment = (<h3>{turn}'s turn. Make a move!</h3>);
        }
        return (<div>
          {turnFragment}
          <Chessground
            turnColor={this.chessToGround(chess.turn())}
            movable={this.calcMovable()}
            fen={FEN.value}
            onMove={this.onMove}
            orientation={this.chessToGround(chess.turn())}
            viewOnly={viewOnlyFlag}
          />
          </div>
        )
      }
    }
  }

  calcMovable = () => {
    var dests = this.formatToChessground();
    return {
      free: false,
      dests,
      color: this.chessToGround(chess.turn())
    }
  }

  formatToChessground = () => {
    var destinationObject = {};
    chess.SQUARES.forEach(square => {
      const moveToObject = chess.moves({square: square, verbose: true})
      if(moveToObject.length > 0) {
          destinationObject[square] = moveToObject.map(m => m.to);
      }
    })
    return destinationObject;
  }

      
  onMove = (from, to) => {
    chess.move({from: from, to: to});
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.ChessGame;
    const setBoardStackId = contract.methods["voteTurn"].cacheSend(
      chess.fen(), 
      { 
        from: drizzleState.accounts[0],
        gas: 1000000
      }
    );
    this.setState({ setBoardStackId });
    return
  }
}

export default withRouter(ChessBoard);