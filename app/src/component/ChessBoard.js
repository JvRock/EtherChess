import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Chessground from 'react-chessground';
import 'react-chessground/dist/styles/chessground.css';
import Chess from "chess.js"
import { Button } from 'reactstrap';
import json from "../contracts/ChessGame.json"
import Web3 from 'web3';
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
    if (this.state.loading || this.props.drizzleState.contracts.ChessGame === undefined) return "Loading Drizzle...";
    else {
      const { ChessGame } = this.props.drizzleState.contracts;
      const FEN = ChessGame.getBoardState[this.state.boardDataKey];
      if(FEN === undefined) {
        return "Loading FEN..."
      } else {
        chess.load(FEN.value);
        console.log(FEN.value);
        return (
          <Chessground
            turnColor={this.chessToGround(chess.turn())}
            movable={this.calcMovable()}
            fen={FEN.value}
            onMove={this.onMove}
          />
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

export default withRouter(ChessBoard);