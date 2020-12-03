import React, { useState } from 'react';
import Chessground from 'react-chessground';
import 'react-chessground/dist/styles/chessground.css';
import Chess from "chess.js"
import { Button } from 'reactstrap';

const chess = new Chess();
class ChessBoard extends React.Component {
  state = { dataKey: null };
  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.ChessGame;
    //console.log(contract);
    // let drizzle know we want to watch the `getBoardState` method
    const boardDataKey = contract.methods["getBoardState"].cacheCall();
    //console.log("hi", dataKey);
    // save the `dataKey` to local component state for later reference
    this.setState({ boardDataKey });
  }

  chessToGround = (turn) => {
    if(turn === "w") return "white"
    else return "black";
  }

  render() {
    if (this.state.loading) return "Loading Drizzle...";
    else {
      const { ChessGame } = this.props.drizzleState.contracts;
      const FEN = ChessGame.getBoardState[this.state.boardDataKey];
      if(FEN === undefined) {
        return "Loading FEN..."
      } else {
        chess.load(FEN.value);
        return (
          <div className="App">
            <Chessground
              turnColor={this.chessToGround(chess.turn())}
              movable={this.calcMovable()}
              fen={FEN.value}
              onMove={this.onMove}
            />
            <br/>
            <Button color="secondary">Submit Move</Button>
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
    console.log(chess.fen());
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









export default ChessBoard;