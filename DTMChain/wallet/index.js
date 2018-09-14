const {
  INITIAL_BALANCE
} = require('../config');
const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');

class Wallet {
  constructor(privateKey) {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair(privateKey);
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = 'BLOCKCHAIN_WALLET';
    return blockchainWallet;
  }

  calculateBalance(blockchain) {
    let startTime = 0;
    let balance = this.balance;
    let transactions = [];
    blockchain.chain.forEach(block => {
      return !block.data.length ? [] : block.data.forEach(transaction => {
        transactions.push(transaction);
      })
    });
    const walletInputs = transactions.filter(transaction => transaction.input.address === this.publicKey);

    if (walletInputs.length) {
      const recentInput = walletInputs.reduce((previous, current) => {
        return previous.input.timestamp > current.input.timestamp ? previous : current;
      });

      balance = recentInput.outputs.find(output => output.address === this.publicKey).amount;
      startTime = recentInput.input.timestamp;

    }

    transactions.forEach(transaction => {
      if (transaction.input.timestamp > startTime && transaction.outputs.length) {
        transaction.outputs.find(output => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });

    return balance;
  }

  createTransaction(recipient, inputAmount, inputFees, blockchain, transactionPool) {
    this.balance = this.calculateBalance(blockchain);

    const amount = Number(inputAmount);
    const fees = Number(inputFees);

    if ((amount + fees) > this.balance) {
      console.log(`Amount (& fees): ${amount + fees}, exceeds current balance: ${this.balance}`);
      return;
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);
    if (transaction) {
      transaction.update(this, recipient, amount, fees);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount, fees);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  toString() {
    return `Wallet -
    publicKey : ${this.publicKey.toString()}
    balance   : ${this.balance}`
  }
}

module.exports = Wallet;
