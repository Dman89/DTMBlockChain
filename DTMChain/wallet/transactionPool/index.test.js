const TransactionPool = require('./index');
const Transaction = require('../transaction');
const Wallet = require('../index');
const Blockchain = require('../../blockchain');
const ChainUtil = require('../../chainUtil');

describe('TransactionPool', () => {
  let tp, wallet, transaction, blockchain, amount, fee, fees, invalidWallet;
  beforeEach(() => {
    blockchain = new Blockchain();
    tp = new TransactionPool();
    wallet = new Wallet();
    invalidWallet = new Wallet();
    transaction = new Transaction();
    amount = 30;
    fee = 1;
    fees = fee;
    transaction = wallet.createTransaction('New-Address-t3xt', amount, fee, blockchain, tp);
  });

  it('adds a transaction to the pool', () => {
    expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
  });

  it('only adds a valid transaction to the pool', () => {
    transaction.input.signature = invalidWallet.sign(ChainUtil.hash(transaction.outputs));
    expect(tp.updateOrAddTransaction(transaction)).toEqual(false);
  });

  it('updates a transaction in the pool', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, '2nd-4ddre55', amount, fee);
    tp.updateOrAddTransaction(newTransaction);
    expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
      .not.toEqual(oldTransaction);
  });

  it('clears transactions', () => {
    tp.clearTransactions();
    expect(tp.transactions).toEqual([]);
  });

  describe('mixing valid and corrupt transactions', () => {
    let validTransactions;
    beforeEach(() => {
      validTransactions = [...tp.transactions];
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction('r4nd-4dr355', amount, fee, blockchain, tp);
        if (i % 2 == 0) {
          transaction.input.amount = 9999;
        } else {
          fees += transaction.fees;
          validTransactions.push(transaction);
        }
      }
    });

    it('shows a difference between valid and corrupt transactions', () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
    });

    it('grabs valid transactions', () => {
      expect(tp.validTransactions().transactions).toEqual(validTransactions);
    });

    it(`grabs valid transactions's fees`, () => {
      expect(tp.validTransactions().fees).toEqual(fees);
    });

  });

});
