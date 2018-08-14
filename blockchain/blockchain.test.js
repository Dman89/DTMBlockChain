const Blockchain = require('./index');
const Block = require('../block');

describe('Blockchain', () => {
  let blockchain, blockchain2;
  beforeEach(() => {
    blockchain = new Blockchain();
    blockchain2 = new Blockchain();
  });

  it('starts with the genesis block', () => {
	  expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it('adds a new block', () => {
    const data = 'Valid Input';
    blockchain.addBlock(data);
    expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(data);
  });

  it('validates a valid chain', () => {
  	blockchain2.addBlock('Valid Input');
  	expect(blockchain.isValidChain(blockchain2.chain)).toBe(true);
  });

  it('invalidates a chain with a corrupt genesis block', () => {
  	blockchain2.chain[0].data = 'Corrupt Input';
    expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
  });

  it('invalidates a corrupt chain', () => {
    blockchain2.addBlock('Valid Input');
    blockchain2.chain[1].data = 'Corrupt Input';
    expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
  });
});
