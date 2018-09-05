const ChainUtil = require('../../chain-util');
const {
  MINING_REWARD
} = require('../../config');

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
    this.fees = 0;
  }

  static newTransaction(senderWallet, recipient, amount, fee) {
    // TODO Run a check with the public key and dont trust user input
    if (amount + fee > senderWallet.balance) {
      console.log(`Amount (& fee): ${amount + fee} exceeds balance.`);
      return;
    }

    return Transaction.transactionWithOutputs(senderWallet, [{
          amount: senderWallet.balance - amount - fee,
          address: senderWallet.publicKey
        },
        {
          amount,
          address: recipient
        }
      ],
      fee);
  }

  static rewardTransaction(minerWallet, blockchainWallet, fees) {
    return Transaction.transactionWithOutputs(blockchainWallet, [{
        amount: MINING_REWARD + fees,
        address: minerWallet.publicKey
      }],
      0);
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    };
  }

  static transactionWithOutputs(senderWallet, outputs, fee) {
    const transaction = new this();
    transaction.fees += fee;
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }

  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    );
  }

  update(senderWallet, recipient, amount, fee) {
    const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

    if (amount + fee > senderOutput.amount) {
      console.log(`Amount (& fee): ${amount + fee} exceeds balance.`);
      return;
    }

    senderOutput.amount = senderOutput.amount - (amount + fee);
    this.fees += fee;
    this.outputs.push({
      amount,
      address: recipient
    });
    Transaction.signTransaction(this, senderWallet);

    return this;
  }
}

module.exports = Transaction;