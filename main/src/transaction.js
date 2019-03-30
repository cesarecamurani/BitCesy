import {createHash, createECDH, createSign, createVerify} from 'crypto';
const CONFIG = exports.CONFIG = ({BLOCK_DIFFICULTY: 2, BLOCK_REWARD: 50});
import  Wallet from './wallet';

const wallet = new Wallet();

class Transaction {

  constructor(opts={}) {
    /*
    Object.assign() copies the values (of all enumerable own properties)
    from one or more source objects to a target object.
    It has a signature of Object.assign(target, ...sources).
    The target object is the first parameter and is also used as the return value.
    */
    Object.assign(this, {
      from: null, to: null, value: 0, nonce: 0, signature: null,
    }, opts);
  }
  // Hash: Returns current transaction hash based on its fields (excepting signature value).
  hash() {
    /*
    JSON.stringify() method converts a JavaScript object or value to a JSON string.
    Nonce: Number of successful transactions made by the sender before,
    used to prevent multiple usage of the same transaction.
    */
    const head = JSON.stringify(this, ['from', 'to', 'value', 'nonce']);
    /*
    SHA (Secure Hash Algorithm) is one of a number of cryptographic hash functions.
    A cryptographic hash is like a signature for a text or a data file.
    SHA-256 algorithm generates an almost-unique, fixed size 256-bit (32-byte) hash.
    .update updates the hash content with the given data(head in this case).
    .digest calculates the digest of all of the data passed to be hashed (using the hash.update() method)
    and return a string based on the encoding(in this case hexadecimal).
    */
    return createHash('SHA256').update(head).digest('hex');
  }

  sign(privateKey) {
    const cert = wallet.getNodePrivateKey(this.from, privateKey);
    const signature = createSign('SHA256').update(this.hash()).sign(cert, 'hex');
    return new Transaction({...this, signature});
  }

  certify() {
    const cert = wallet.getNodePublicKey(this.from);
    const signature = createVerify('SHA256').update(this.hash());
    if (!(this.from) || !(this.signature))  return false;
    return signature.verify(cert, this.signature, 'hex');
  }
}
export default Transaction
