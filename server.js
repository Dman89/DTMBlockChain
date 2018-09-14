const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Blockchain = require('./DTMChain/blockchain');
const Wallet = require('./DTMChain/wallet');
const TransactionPool = require('./DTMChain/wallet/transaction-pool');
const Miner = require('./DTMChain/miner');
const P2pServer = require('./DTMChain/p2p-server');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const blockchain = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(blockchain, tp);
const miner = new Miner(blockchain, tp, wallet, p2pServer);

app.use(bodyParser.json());
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use("/", express.static(path.join(__dirname, 'public')))

app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});

app.get('/balance', (req, res) => {
  res.json({
    balance: wallet.calculateBalance(blockchain),
    publicKey: wallet.publicKey
  });
});

app.get('/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/mine', (req, res) => {
  const block = blockchain.addBlock(req.body.data);
  const displayMessage = `New block added:
  ${block.toString()}
  `;
  console.log(displayMessage);
  p2pServer.syncChains(displayMessage);
  res.redirect('/blocks');
});

app.get('/mine-transactions', (req, res) => {
  const block = miner.mine();
  const displayMessage = `New block added:
  ${block.toString()}
  `;
  res.redirect('/blocks');
});

app.post('/transact', (req, res) => {
  const {
    recipient,
    amount,
    fee
  } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, fee || 1, blockchain, tp);
  p2pServer.broadcastTransaction(transaction, 'Transaction processed!');
  res.redirect('/transactions');
});

app.get('/transactions', (req, res) => {
  res.json(tp.transactions);
});

app.get('/public-key', (req, res) => {
  res.json({
    publicKey: wallet.publicKey
  });
});

app.listen(HTTP_PORT, () => console.log(`Listening on the port ${HTTP_PORT}`));
p2pServer.listen();
