const Transaction = require('../transaction');

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  clear() {
    this.transactions = [];
  }

  existingTransaction(address) {
    return this.transactions.find(transaction => transaction.input.address === address);
  }

  updateOrAddTransaction(transaction) {
    let transactionWithId = this.transactions.find(t => t.id === transaction.id);

    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  validTransactions() {
    let fees = 0;
    const transactions = this.transactions.filter(transaction => {

      const outputTotal = transaction.outputs.reduce((total, output) => {
        return total + output.amount;
      }, 0);

      if (transaction.input.amount !== (outputTotal + transaction.fees)) {
        console.log(`Invalid transaction from ${transaction.input.address}.`);
        return;
      }

      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.input.address}.`)
        return;
      };

      fees += transaction.fees;

      return transaction;
    });

    return {
      fees,
      transactions
    };
  }

}

module.exports = TransactionPool;