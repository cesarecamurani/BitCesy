import {createHash, createECDH, createSign, createVerify} from 'crypto';
const CONFIG = exports.CONFIG = ({BLOCK_DIFFICULTY: 2, BLOCK_REWARD: 50});

class Block {

  constructor(opts={}) {
    /*
    Object.assign() copies the values (of all enumerable own properties)
    from one or more source objects to a target object.
    It has a signature of Object.assign(target, ...sources).
    The target object is the first parameter and is also used as the return value.
    */
    Object.assign(this, {
        parentHash: null,
        stateHash: null,
        miner: null,
        nonce: 0,
        transactions: [],
    }, opts);
  }

  hash() {
    // JSON.stringify() method converts a JavaScript object or value to a JSON string.
    const head = JSON.stringify(this,['parentHash', 'stateHash', 'miner', 'nonce']);
    const tail = JSON.stringify(this.transactions.map(tx => tx.hash()));
    /*
    SHA (Secure Hash Algorithm) is one of a number of cryptographic hash functions.
    A cryptographic hash is like a signature for a text or a data file.
    SHA-256 algorithm generates an almost-unique, fixed size 256-bit (32-byte) hash.
    .update updates the hash content with the given data(head in this case).
    .digest calculates the digest of all of the data passed to be hashed (using the hash.update() method)
    and return a string based on the encoding(in this case hexadecimal).
    */
    return createHash('SHA256').update(head + tail).digest('hex');
  }

  mine(min = 0, max = Number.MAX_SAFE_INTEGER) {
    /*
    Nonce: Number of successful transactions made by the sender before,
    used to prevent multiple usage of the same transaction.
    */
    for (let nonce = min; nonce <= max; nonce++) {
      // creates a new Block.
      const block = new Block({...this, nonce});
      // if block.test() passes returns this new Block.
      if (block.test()) return block;
    }
  }
  // it checks the block authenticity
  test() {
    const mask = '0'.repeat(CONFIG.BLOCK_DIFFICULTY);
    // checks if the stringified hash starts with the mask(00)
    return this.hash().startsWith(mask);
  }
}
export default Block
