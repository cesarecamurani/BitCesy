import {createHash, createECDH, createSign, createVerify} from 'crypto';
const CONFIG = exports.CONFIG = ({BLOCK_DIFFICULTY: 2, BLOCK_REWARD: 50});
import Wallet from '../src/wallet';
import Transaction from '../src/transaction';

class State {

  constructor(opts={}) {
    Object.assign(this, {wallets: {}}, opts);
  }

  hash() {
    const keys = Object.keys(this.wallets).sort();
    const head = JSON.stringify(keys);
    const tail = JSON.stringify(keys.map(wl => this.wallets[wl]));
    return createHash('SHA256').update(head + tail).digest('hex');
  }

  with(mt) {
    if (mt instanceof Transaction) {
      const sender = this.wallets[mt.from] || {value: 0, nonce: 0};
      const target = this.wallets[(mt.to)] || {value: 0, nonce: 0};
      return new State({ ...this, wallets: { ...this.wallets,
        [mt.from]: {value: sender.value - mt.value, nonce: sender.nonce + 1},
        [(mt.to)]: {value: target.value + mt.value, nonce: target.nonce},
      }});
    } else {
      const miner = this.wallets[mt.miner] || {value: 0, nonce: 0};
      return new State({ ...this, wallets: { ...this.wallets,
        [mt.miner]: {...miner, value: miner.value + CONFIG.BLOCK_REWARD},
      }});
    }
  }
}
export default State
