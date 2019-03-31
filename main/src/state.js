import {createHash, createECDH, createSign, createVerify} from 'crypto';
const CONFIG = exports.CONFIG = ({BLOCK_DIFFICULTY: 2, BLOCK_REWARD: 50});
import Wallet from '../src/wallet';
import Transaction from '../src/transaction';

class State {

  constructor(opts={}) {
    /*
    Object.assign() copies the values (of all enumerable own properties)
    from one or more source objects to a target object.
    It has a signature of Object.assign(target, ...sources).
    The target object is the first parameter and is also used as the return value.
    */
    Object.assign(this, {wallets: {}}, opts);
  }
  // Hash iterates over existing accounts and uses them to get the current state hash.
  hash() {
    /* Object.keys() takes the object as an argument (this.wallets)
    and returns an array of strings that represent all
    the enumerable properties of the given object(sorted by .sort()).
    */
    const keys = Object.keys(this.wallets).sort();
    // keys are converted in a JSON string and assigned to head
    const head = JSON.stringify(keys);
    // keys array is mapped and for each key each value and nonce(JSON.stringified) are assigned to tail
    const tail = JSON.stringify(keys.map(wl => this.wallets[wl]));
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

  with(mt) {
    if (mt instanceof Transaction) {
      /*
      Consumes transaction and returns updated state, increasing the sender nonce
      with a proper coin amount transferred from one account to another.
      */
      const sender = this.wallets[mt.from] || {value: 0, nonce: 0};
      const target = this.wallets[(mt.to)] || {value: 0, nonce: 0};
      return new State({ ...this, wallets: { ...this.wallets,
        [mt.from]: {value: sender.value - mt.value, nonce: sender.nonce + 1},
        [(mt.to)]: {value: target.value + mt.value, nonce: target.nonce},
      }});
    } else {
      /*
      Consumes block and returns updated state,
      with appropriate reward (CONFIG.BLOCK_REWARD) sent to the the miner account. 
      */
      const miner = this.wallets[mt.miner] || {value: 0, nonce: 0};
      return new State({ ...this, wallets: { ...this.wallets,
        [mt.miner]: {...miner, value: miner.value + CONFIG.BLOCK_REWARD},
      }});
    }
  }
}
export default State
