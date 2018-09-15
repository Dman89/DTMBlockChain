const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const PEERS = process.env.PEERS ? process.env.PEERS.split(',') : [];

const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clearTransactions: 'CLEAR_TRANSACTIONS'
};

let lastChainLength = 0;
let lastTransaction = '';

class P2pServer {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }

  listen() {
    const server = new Websocket.Server({
      port: P2P_PORT
    });
    server.on('connection', socket => this.connectSocket(socket));
    server.on('close', (message) => {
      console.log(message);
    })
    this.connectToPeers();
    this.log(`Listening to P2P connections on port: ${P2P_PORT}`, true);
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    this.messageHandler(socket);
    this.sendChain(socket, 'Socket connected');
  }

  connectToPeers() {
    PEERS.forEach(peer => {
      const socket = new Websocket(peer);
      socket.on('open', () => this.connectSocket(socket));
    });
  }

  messageHandler(socket) {
    socket.on('message', message => {
      this.messageHandlerFn(message);
    });
  }

  messageHandlerFn(message) {
    const data = JSON.parse(message);
    switch (data.type) {
      case MESSAGE_TYPES.chain:
        this.blockchain.replaceChain(data.chain);
        this.log(data.displayMessage, (lastChainLength !== data.chain.length));
        lastChainLength = data.chain.length;
        break;
      case MESSAGE_TYPES.transaction:
        this.transactionPool.updateOrAddTransaction(data.transaction);
        this.log(data.displayMessage, (lastTransaction !== data.transaction.input.timestamp));
        lastTransaction = data.transaction.input.timestamp;
        this.broadcastTransaction(data.transaction, data.message);
        break;
      case MESSAGE_TYPES.clearTransactions:
        this.transactionPool.clear();
        break;
    }
  }

  sendChain(socket, displayMessage) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.chain,
      displayMessage,
      chain: this.blockchain.chain
    }));
  }

  syncChains(displayMessage) {
    this.sockets.forEach(socket => {
      this.sockets.forEach(socket => this.sendChain(socket, displayMessage));
    });
  }

  sendTransaction(socket, transaction, displayMessage) {
    this.log(displayMessage, lastTransaction !== transaction.input.timestamp);
    lastTransaction = transaction.input.timestamp;
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.transaction,
      transaction,
      displayMessage
    }));
  }

  broadcastTransaction(transaction, message) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction, message));
  }

  broadcastClearTransactions() {
    this.sockets.forEach(socket => socket.send(JSON.stringify({
      type: MESSAGE_TYPES.clearTransactions
    })));
  }

  log(displayMessage, broadcast) {
    if (displayMessage && broadcast) {
      console.log(`P2P Server: ${P2P_PORT} - ${displayMessage}`);
    }
    return broadcast;
  }

}

module.exports = P2pServer;
