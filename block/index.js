const SHA256 = require('crypto-js/sha256');

const DIFFICULTY = 7;

class Block {
  constructor(block) {
    const {
      timestamp,
      lastHash,
      hash,
      data,
      nonce
    } = block;
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
  }

  static blockHash(block) {
  	const { timestamp, lastHash, data, nonce } = block;
    return Block.hash(timestamp, lastHash, data, nonce);
  }

  static genesis() {
    const block = {
      timestamp: 'Genesis time',
      lastHash: 'Alpha&Omega',
      hash: 'DanTheMan',
      data: [],
      nonce: DIFFICULTY
    };
    return new this(block);
  }

  static hash(timestamp, lastHash, data, nonce) {
    return SHA256(`${timestamp}${lastHash}${data}${nonce}`).toString();
  }

  static mineBlock(lastBlock, data) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const nonce = DIFFICULTY;
    const hash = Block.hash(timestamp, lastHash, data, nonce);
    return new this({timestamp, lastHash, hash, data, nonce});
  }

  toString() {
    return `Block -
    Timestamp: ${this.timestamp}
    Last Hash: ${this.lastHash.substring(0,10)}
    Hash     : ${this.hash.substring(0,10)}
    Nonce    : ${this.nonce}
    Data     : ${this.data}`;
  }
}

module.exports = Block;
