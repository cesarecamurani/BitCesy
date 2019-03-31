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
  /*
  Checks sender balance and nonce, ensures that transactions are correctly ordered and
  that current signature is valid.
  */
  static verifyTransaction(prev, state, transaction) {
    const sender = state.wallets[transaction.from] || {value: 0};
    if (transaction.value <= 0 || sender.value < transaction.value) throw Error('Bad value.');
    if (transaction.nonce <  0 || sender.nonce > transaction.nonce) throw Error('Bad nonce.');
    if (prev && prev.nonce > transaction.nonce) throw Error('Bad nonce order.');
    // checks for right signature
    if (!transaction.certify()) throw Error('Transaction is not signed properly.');
    return state.with(transaction);
  }
  /*
  Compares block parent and state hashes with current ones,
  checks mining status and runs verification process for its transactions.
  */
  static verifyBlock(prev, state, block) {
    // checks for right parentHash
    if (prev && block.parentHash !== prev.hash()) throw Error('Bad parentHash.');
    // checks for right stateHash
    if (prev && block.stateHash  !== state.hash()) throw Error('Bad stateHash.' )
    // checks for the block to be valid
    if (!block.test()) throw Error('Block is not mined properly.');
    console.log(block.transactions.reduce((state, transaction, index) => {
      const prev = block.transactions[index - 1] || (null);
      return Blockchain.verifyTransaction(prev, state, transaction);
    }, state.with(block)))
    return block.transactions.reduce((state, transaction, index) => {
      const prev = block.transactions[index - 1] || (null);
      return Blockchain.verifyTransaction(prev, state, transaction);
    }, state.with(block));
  }
  // Returns current account balance if it exists, returns zero balance otherwise.
  balance(address) {
    if (!this.state.wallets[address]) return (0);
    return this.state.wallets[address].value;
  }
  // Verifies block and pushes it into the current blockchain by updating its state and history.
  push(block) {
    // const prev is assigned to the previous block
    const prev = (this.blocks[this.blocks.length - 1]) || (null);
    // this.state is assigned to blockchain.verifyBlock and updated 
    this.state = Blockchain.verifyBlock(prev, this.state, block);
    // block is eventually pushed into the blockchain blocks array
    this.blocks.push(block);
  }
  // A wrapper for the previous method that automatically mines block and pushes it into the blockchain.
  mine(miner, transactions=[]) {
    // const prev is assigned to the previous block
    const prev = (this.blocks[this.blocks.length - 1]) || (null);
    this.push(new Block({
      parentHash:   prev && prev.hash(),
      stateHash:    this.state.hash(),
      transactions, miner,
    }).mine());
  }
}
export default Blockchain
