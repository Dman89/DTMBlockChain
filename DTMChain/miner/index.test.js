const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');
const TransactionPool = require('../wallet/transactionPool');
const Blockchain = require('../blockchain');
const Miner = require('./index');
const Block = require('../block');
const {
  MINING_REWARD
} = require('../config');

describe('Miner Functionality', () => {
  let miner,
    transactionPool,
    wallet,
    blockchain,
    transaction,
    validTransaction,
    validTransactions,
    minedBlock,
    recipient;
  beforeEach(() => {
    blockchain = new Blockchain();
    wallet = new Wallet();
    recipient = new Wallet();
    transactionPool = new TransactionPool();
    transaction = new Transaction();
    validTransaction = Transaction.newTransaction(wallet, recipient.publicKey, 50, 1);
    transactionPool.updateOrAddTransaction(validTransaction);
    validTransactions = transactionPool.validTransactions();
    miner = new Miner(blockchain, transactionPool, wallet);
    minedBlock = miner.mine();
  });

  it('Miner class clears transactions', () => {
    expect(transactionPool.transactions).toEqual([]);
  });

  it('Miner rejects bad chains', () => {
    const invalidChain = [Blockchain.genesis, Blockchain.genesis];
    blockchain.chain = invalidChain;
    const invalidMiner = new Miner(blockchain, transactionPool, wallet);
    expect(invalidMiner.mine()).toEqual(false);
  });

  it('Reward the miner', () => {
    expect(minedBlock.data[minedBlock.data.length - 1].outputs[0].address).toEqual(wallet.publicKey);
  });

  // TODO
  // it('Blockchain wallet rewards the miner', () => {
  //   expect(minedBlock.data[minedBlock.data.length - 1].input.address).toEqual(Wallet.blockchainWallet().publicKey);
  // });
  
  it('Only reward the miner with the MINING_REWARD and fees', () => {
    const reward = validTransactions.fees + MINING_REWARD;
    expect(minedBlock.data[minedBlock.data.length - 1].outputs[0].amount).toBe(reward);
  });
});
