import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import drizzle functions and contract artifact
import { Drizzle } from "@drizzle/store";
import ChessGame from "./contracts/ChessGame.json";
import GameCreator from "./contracts/GameCreator.json";
import BoardState from "./contracts/BoardState.json";
import 'bootstrap/dist/css/bootstrap.min.css';

const options = {
  contracts: [ChessGame, GameCreator],
  web3: {
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:9545",
    },
  },
};

const drizzle = new Drizzle(options);

ReactDOM.render(<App drizzle={drizzle} />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
