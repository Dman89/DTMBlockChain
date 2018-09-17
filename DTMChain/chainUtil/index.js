const EC = require('elliptic').ec;
const ec = new EC('ed25519') /*|| new EC('secp256k1')*/;
const uuidV1 = require('uuid/v1');
const SHA256 = require('crypto-js/sha256');

// Generate a key pair: server side
// use an ssl connection to send the public key from the server to the client
// Use the public key to encrypt the Wallet's private key on the client side
// decode with the private key on the server with the Generated key pair

class ChainUtil {
  static genKeyPair(privateKey) {
    if (privateKey) {
      return ec.keyFromSecret(privateKey);
    }
    return ec.genKeyPair();
  }

  static id() {
    return uuidV1();
  }

  static hash(data) {
    return SHA256(JSON.stringify(data)).toString();
  }

  static verifySignature(publicKey, signature, dataHash) {
    return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
  }

}

module.exports = ChainUtil;
