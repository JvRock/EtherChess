import React from "react";
import { Button, Label, Input, FormGroup, Form  } from 'reactstrap';
import { Link } from "react-router-dom";

class NewGame extends React.Component {

  constructor(props) {
    super(props);
      this.state = {
      'teamWhite': '',
      'teamBlack': '',
      'contractAddress': '',
    }
    this.handleChange = this.handleChange.bind(this);
  }

  state = { loading: true, latestGame: null, gameSizeKey: null, createGameStackId: null };

  componentDidMount() {
    const { drizzle } = this.props;
    var state = drizzle.store.getState();
    const contract = drizzle.contracts.GameCreator;

    // let drizzle know we want to watch the `getGamesSize` & `latestGame` method
    if(this.props.drizzleState.accounts[0] != null) {
      const latestGame = contract.methods["latestGame"].cacheCall(this.props.drizzleState.accounts[0]);
      this.setState({ latestGame });
    }
    const gameSizeKey = contract.methods["getGamesSize"].cacheCall();
    // save the `dataKey` to local component state for later reference
    this.setState({ gameSizeKey });
  }

  handleChange = async (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    await this.setState({
      [ name ]: value,
    });
    console.log(this.state);
  }



  render() {
    console.log(this.props);
    if (this.state.loading) return "Loading from Blockchain...";
    if (this.state.createGameStackId != null) {
      return this.getTxStatus();
    }
    else {
      // get the contract state from drizzleState
      const { GameCreator } = this.props.drizzleState.contracts;
      // using the saved `dataKey`, get the variable we're interested in
      const gameSize = GameCreator.getGamesSize[this.state.gameSizeKey];

      // if it exists, then we display its value
      const formGroup = (
            <Form>
              <FormGroup>
                <Label for="teamWhite">Enter White's Ethereum Public Key</Label>
                <Input type="textarea" name="teamWhite" id="teamWhite" 
                  onChange={
                    (e) => {
                      this.handleChange(e)
                    } 
                  }
                />
                <Label for="teamBlack">Enter Black's Ethereum Public Key</Label>
                <Input type="textarea" name="teamBlack" id="teamBlack" 
                  onChange={
                    (e) => {
                      this.handleChange(e)
                    } 
                  }
                />
                <Button type="button" onClick={() => this.createGame(this.state.teamWhite, this.state.teamBlack, 50)}>Create new Game</Button>
                <br/>
                <Label for="contractAddress">Or enter an existing contract code</Label>
                <Input type="textarea" name="contractAddress" id="contractAddress" 
                  onChange={
                    (e) => {
                      this.handleChange(e)
                    } 
                  }
                />
                <Link to={{pathname: "/ChessGame/" + this.state.contractAddress, state: {address: this.state.contractAddress} }}> Go to Game</Link>
              </FormGroup>
            </Form>
      )
      return formGroup;
    }
  }
  handleClick() {
    this.createGame(this.state.teamWhite, this.state.teamBlack, 50);
  }

  goToGame(address) {
    console.log("hi");
    var existingGame = address;
    this.setState({existingGame}); 
  }

  getTxStatus = () => {
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = this.props.drizzleState;

    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.createGameStackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash || transactions[txHash] === undefined) return null;
    console.log(transactions[txHash]);
    // otherwise, return the transaction status
    const { GameCreator } = this.props.drizzleState.contracts;
    if(transactions[txHash].status != "success") {
      return "transaction error";
    } else {
      const existingGame = GameCreator.latestGame[this.state.latestGame];
      console.log(existingGame);
      const returnStatement = (
          `Transaction Success! New Contract is: ${existingGame.value}. Write it down, and Enter it into the box below to play Chess`
      );
      return returnStatement;
    }
  }

  createGame = (teamWhite, teamBlack, blockFactor) => {
    console.log([teamWhite], teamBlack, blockFactor);
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.GameCreator;
    const createGameStackId = contract.methods["newGame"].cacheSend(
      [teamWhite], [teamBlack], blockFactor, {
        from: drizzleState.accounts[0],
        gas: 2000000
      }
    );
    this.setState({createGameStackId});
  }
}

export default NewGame;