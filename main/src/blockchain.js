import {createHash, createECDH, createSign, createVerify} from 'crypto';
const CONFIG = exports.CONFIG = ({BLOCK_DIFFICULTY: 2, BLOCK_REWARD: 50});
import Wallet from '../src/wallet';
import Transaction from '../src/transaction';
import Block from './block';
import State from './state';

class Blockchain {
  constructor(opts={}) {
    /*
    Object.assign() copies the values (of all enumerable own properties)
    from one or more source objects to a target object.
    It has a signature of Object.assign(target, ...sources).
    The target object is the first parameter and is also used as the return value.
    */
    Object.assign(this, {
      state: new State(),
      blocks: new Array(),
    }, opts);
  }

  static verifyTransaction(prev, state, tx) {
    const sender = state.wallets[tx.from] || {value: 0};
    if (tx.value <= 0 || sender.value < tx.value) throw Error('Bad value.');
    if (tx.nonce <  0 || sender.nonce > tx.nonce) throw Error('Bad nonce.');
    if (prev && prev.nonce > tx.nonce) throw Error('Bad nonce order.');
    if (!tx.certify()) throw Error('Transaction is not signed properly.');
    return state.with(tx);
  }

  static verifyBlock(prev, state, block) {
    if (prev && block.parentHash !== prev .hash()) throw Error('Bad parentHash.');
    if (prev && block.stateHash  !== state.hash()) throw Error('Bad stateHash.' )
    if (!block.test()) throw Error('Block is not mined properly.');
    return block.transactions.reduce((state, tx, index) => {
      const prev = block.transactions[index - 1] || (null);
      return Blockchain.verifyTransaction(prev, state, tx);
    }, state.with(block));
  }

  balance(address) {
    if (!this.state.wallets[address]) return (0);
    return this.state.wallets[address].value;
  }

  push(block) {
    const prev = (this.blocks[this.blocks.length - 1]) || (null);
    this.state = Blockchain.verifyBlock(prev, this.state, block);
    this.blocks.push(block);
  }

  mine(miner, transactions=[]) {
    const prev = (this.blocks[this.blocks.length - 1]) || (null);
    this.push(new Block({
      parentHash:   prev && prev.hash(),
      stateHash:    this.state.hash(),
      transactions, miner,
    }).mine());
  }
}
export default Blockchain
