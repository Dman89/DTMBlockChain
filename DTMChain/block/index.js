const ChainUtil = require('../chainUtil');
const {
  DIFFICULTY,
  MINE_RATE_MIN,
  MINE_RATE_MAX
} = require('../config');

class Block {
  constructor(block) {
    const {
      timestamp,
      lastHash,
      hash,
      data,
      nonce,
      difficulty
    } = block;
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  static blockHash(block) {
    const {
      timestamp,
      lastHash,
      data,
      nonce,
      difficulty
    } = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  static genesis() {
    const block = {
      timestamp: 'Genesis time',
      lastHash: 'Alpha&Omega',
      hash: 'DanTheMan',
      nonce: 0,
      difficulty: DIFFICULTY,
      data: []
    };
    return new this(block);
  }

  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
  }

  static mineBlock(lastBlock, data) {
    let hash,
      timestamp,
      nonce = 0;
    const lastHash = lastBlock.hash;
    let {
      difficulty
    } = lastBlock;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
    return new this({
      timestamp,
      lastHash,
      hash,
      data,
      nonce,
      difficulty
    });
  }

  toString() {
    return `Block -
    Timestamp  : ${this.timestamp}
    Last Hash  : ${this.lastHash.substring(0,10)}
    Hash       : ${this.hash.substring(0,10)}
    Nonce      : ${this.nonce}
    Difficulty : ${this.difficulty}
    Data       : ${this.data.length}`;
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let {
      difficulty
    } = lastBlock;
    if (lastBlock.timestamp + MINE_RATE_MAX < currentTime) {
      difficulty -= 1;
    } else if (lastBlock.timestamp + MINE_RATE_MIN > currentTime) {
      difficulty += 1;
    }
    return difficulty;
  }
}

module.exports = Block;