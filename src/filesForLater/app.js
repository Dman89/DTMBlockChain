import React from "react";
import ReactDOM from "react-dom";
import Wallet from '../wallet';
import Transaction from '../wallet/transaction';
import TransactionPool from '../wallet/transaction-pool';
import Blockchain from '../blockchain';
import P2pServer from '../app/p2p-server';
const tp = new TransactionPool();
const bc = new Blockchain();
const p2pServer = new P2pServer(bc, tp);
const wallet = new Wallet();

const fee = 1;
const amount = 100;
const recipient = 'fake';

let socket = '';
let pingInterval = '';
connectToWebSocket(pingInterval);

function connectToWebSocket(pingInterval) {
  const sockets = [];
  socket = new WebSocket("ws://localhost:5001");
  sockets.push(socket);

  socket.onopen = function open(a) {
    pingInterval = setInterval(function() {
      ping(socket, pingInterval);
    }, 30000);
  };

  socket.onclose = function close() {
    console.log('Disconnected from web socket');
  };

  let lastResponse = '';
  socket.addEventListener('message', function(event) {
    if (lastResponse !== event.data) {
      p2pServer.messageHandlerFn(event.data);
      lastResponse = event.data;
    }
  });
}

function ping(socket, pingInterval) {
  if (socket.readyState === 1) {
    socket.send(JSON.stringify({
      "__ping__": "__ping__"
    }));
    console.log('Connection still established.');
  } else {
    console.log('Attempting to reconnect in thirty seconds.');
    clearInterval(pingInterval);
    setTimeout(() => {
      console.log('Reconnecting...');
      connectToWebSocket();
    }, 30000);
  }
}

class HelloMessage extends React.Component {
  componentWillMount() {

  }
  click() {
    const transaction = wallet.createTransaction(recipient, amount, fee || 1, bc, tp);
    socket.send(JSON.stringify({
      type: 'TRANSACTION',
      displayMessage: 'WORKED!',
      transaction
    }))
  }
  render() {
    return (<div > Hello {
      this.props.name
    }
    <button onClick = {
        function() {
          this.click();
        }.bind(this)
      }> Click Me! </button>
    < /div>);
  }
}

var mountNode = document.getElementById("app");
ReactDOM.render( < HelloMessage name = "Muthu" / > , mountNode);
