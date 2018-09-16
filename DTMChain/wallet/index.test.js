const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');
const {
  INITIAL_BALANCE
} = require('../config');

describe('Wallet', () => {
  let wallet, tp, blockchain;

  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
    blockchain = new Blockchain();
  });

  describe('creating a transaction', () => {
    let transaction, sendAmount, sendFee, recipient;
    beforeEach(() => {
      sendAmount = 50;
      sendFee = 1;
      recipient = 'New-Address-t3xt';
      transaction = wallet.createTransaction(recipient, sendAmount, sendFee, blockchain, tp);
    });

    describe('and doing the same transaction', () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, sendFee, blockchain, tp);
      });

      it('doubles the `sendAmount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
          .toEqual(wallet.balance - ((sendAmount + sendFee) * 2));
      });

      it('clones the `sendAmount` output for the recipient', () => {
        expect(transaction.outputs.filter(output => output.address === recipient)
          .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
      });
    });
  });

  describe('Calculating a balance', () => {
    let addBalance, repeatAdd, senderWallet, fee;

    beforeEach(() => {
      senderWallet = new Wallet();
      addBalance = 100;
      repeatAdd = 3;
      fee = 1;
      for (var i = 0; i < repeatAdd; i++) {
        senderWallet.createTransaction(wallet.publicKey, addBalance, fee, blockchain, tp);
      }
      blockchain.addBlock(tp.transactions);
    });
    it(`Calculates the balance for the receiver's wallet`, () => {
      expect(wallet.calculateBalance(blockchain)).toEqual((INITIAL_BALANCE + (addBalance * repeatAdd)));
    });

    it(`Calculates the balance for the sender's wallet`, () => {
      expect(senderWallet.calculateBalance(blockchain)).toEqual((INITIAL_BALANCE - ((addBalance + fee) * repeatAdd)));
    });

    describe('and the recipient conducts a transaction', () => {
      let subtractBalance, recipientBalance;

      beforeEach(() => {
        tp.clearTransactions();
        subtractBalance = 100;
        recipientBalance = wallet.calculateBalance(blockchain);
        wallet.createTransaction(senderWallet.publicKey, subtractBalance, fee, blockchain, tp);
        blockchain.addBlock(tp.transactions);
      });

      describe('and the sender sends another transaction to the recipient', () => {
        beforeEach(() => {
          tp.clearTransactions();
          senderWallet.createTransaction(wallet.publicKey, addBalance, fee, blockchain, tp);
          blockchain.addBlock(tp.transactions);
        });

        it('calculate the recipient balance only using transactions since its most recent one', () => {
          expect(wallet.calculateBalance(blockchain)).toEqual(recipientBalance - subtractBalance + addBalance - fee);
        });
      });

    });
  });
});
