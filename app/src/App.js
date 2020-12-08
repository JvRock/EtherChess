import React, { Component } from 'react';
import NewGame from "./component/NewGame";
import ChessBoard from "./component/ChessBoard";
import web3 from 'web3';

class App extends Component {
  state = { loading: true, drizzleState: null, existingGame: null };

  componentDidMount() {
    console.log(this.props);

    const { drizzle } = this.props;

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    var account;
    var content;
    if (this.state.loading) return "Loading Drizzle...";
    if (this.state.drizzleState.accounts[0] === null) {
      return "Loading Metamask..." 
    } else {
      account = this.state.drizzleState.accounts[0];
    }
    if(this.state.existingGame === null) {
      content = (
        <NewGame 
          drizzle={this.props.drizzle}
          drizzleState={this.state.drizzleState}
        />
      )
    } else {
      var contractConfig = {
        contractName: this.state.existingGame,
        web3Contract: new web3.eth.Contract(/* ... */)
      }
      var events = ['Mint']
      this.context.drizzle.addContract(contractConfig, events)

      content = (
        <ChessBoard
          drizzle={this.props.drizzle}
          drizzleState={this.state.drizzleState}
        />
      )
    }
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-lg-3"></div>
              <div className="col-lg-6">
                {content}
                <p>Logged in Account:</p>
                <p>{account}</p>
              </div>
            <div className="col-lg-3"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;