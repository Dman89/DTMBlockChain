class TransactionPool {
  constructor() {
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
}

module.exports = TransactionPool;
