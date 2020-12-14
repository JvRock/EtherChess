import React, { Component } from 'react';
import { Link } from "react-router-dom";
import NewGame from "./component/NewGame";
import ChessBoard from "./component/ChessBoard";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


class App extends Component {
  state = { loading: true, drizzleState: null, existingGame: null, mma: null };
  componentDidMount() {

    const { drizzle } = this.props;

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      var drizzleState = drizzle.store.getState();

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

    if (this.state.loading) return "Loading Drizzle...";
    if (this.state.drizzleState.accounts[0] === null) {
      return "Loading Metamask..." 
    } else {
      const { drizzle } = this.props;
      account = this.state.drizzleState.accounts[0];
      window.ethereum.on('accountsChanged', function (accounts) {
        //drizzleState = drizzle.store.getState();
        window.location.reload();
      })
    }

    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-lg-3"></div>
              <div className="col-lg-6">
                <Router>
                  <Route exact path="/" 
                  render={() => (
                    <NewGame 
                      drizzle={this.props.drizzle}
                      drizzleState={this.state.drizzleState}/>
                  )}
                  />
                  <Route path="/chessgame/:address" 
                    render={() => (<ChessBoard           
                      drizzle={this.props.drizzle}
                      drizzleState={this.state.drizzleState}
                      />
                    )}
                    />
                </Router>
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