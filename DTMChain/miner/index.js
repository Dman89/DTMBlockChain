const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');
class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransactionsObject = this.transactionPool.validTransactions();
    const validTransactions = validTransactionsObject.transactions;
    const minerFees = validTransactionsObject.fees;

    validTransactions.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet(), minerFees)
    );

    const block = this.blockchain.addBlock(validTransactions);
    const displayMessage = `New block added: ${block.toString()}`;
    this.p2pServer.syncChains(displayMessage);
    this.p2pServer.log(displayMessage, true);
    this.transactionPool.clear();
    this.p2pServer.broadcastClearTransactions();
    return block;
  }
}

module.exports = Miner;