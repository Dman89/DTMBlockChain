const Block = require('../block');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data) {
    if (!this.isChainValid(this.chain)) {
      return false;
    }
    const block = Block.mineBlock(this.chain[this.chain.length - 1], data);

    this.chain.push(block);

    return block;
  }

  isChainValid(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];
      if (
        block.lastHash !== lastBlock.hash ||
        block.hash !== Block.blockHash(block)
      ) return false;
    }
    return true;
  }

  replaceChain(newChain) {
    if (
      newChain.length <= this.chain.length ||
      !this.isChainValid(newChain)
    ) return;

    this.chain = newChain;
  }

}

module.exports = Blockchain;
