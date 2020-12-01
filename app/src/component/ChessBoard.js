import React, { Component } from 'react';
import Chessground from 'react-chessground'
import 'react-chessground/dist/styles/chessground.css'

class ChessBoard extends Component {

  state = { dataKey: null };
  componentDidMount() {
      const { drizzle } = this.props;
      const contract = drizzle.contracts.ChessGame;
      console.log(contract);
      // let drizzle know we want to watch the `myString` method
      const dataKey = contract.methods["isGameOver"].cacheCall();
      console.log("hi", dataKey);
      // save the `dataKey` to local component state for later reference
      this.setState({ dataKey });
    }
    
    render() {
      console.log(this.props);
      const { ChessGame } = this.props.drizzleState.contracts;
      //console.log(ChessGame.getBoardState)
      const FEN = ChessGame.isGameOver[this.state.dataKey];
      console.log(FEN);
        if (this.state.loading) return "Loading Drizzle...";
        return <div>hi</div>
            /*<div className="App">
                Drizzle is ready  
                <Chessground />
            </div>;*/
    }

}

export default ChessBoard;