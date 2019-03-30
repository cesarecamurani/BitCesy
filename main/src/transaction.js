import {createHash, createECDH, createSign, createVerify} from 'crypto';
const CONFIG = exports.CONFIG = ({BLOCK_DIFFICULTY: 2, BLOCK_REWARD: 50});
import  Wallet from './wallet';

const wallet = new Wallet();

class Transaction {

  constructor(opts={}) {
    Object.assign(this, {
      from: null, to: null, value: 0, nonce: 0, signature: null,
    }, opts);
  }

  hash() {
    const head = JSON.stringify(this, ['from', 'to', 'value', 'nonce']);
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
