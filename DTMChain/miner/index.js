const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');
class Miner {
  constructor(blockchain, transactionPool, wallet) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
  }

  mine() {
    const validTransactionsObject = this.transactionPool.validTransactions();
    const validTransactions = validTransactionsObject.transactions;
    const minerFees = validTransactionsObject.fees;

    validTransactions.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet(), minerFees)
    );

    const block = this.blockchain.addBlock(validTransactions);

    if (!block) {
      return false;
    }

    this.transactionPool.clearTransactions();

    return block;
  }
}

module.exports = Miner;
