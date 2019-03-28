const {createHash, createECDH, createSign, createVerify} = require('crypto');
const CONFIG = exports.CONFIG = ({BLOCK_DIFFICULTY: 2, BLOCK_REWARD: 50});

class Wallet {

  constructor(opts={}) {
    Object.assign(this, {
      publicKey: null,
      privateKey: null,
    }, opts);
  }

  create() {
    const keypair = createECDH('secp256k1');
    keypair.generateKeys();
    return new Wallet({
      publicKey:  keypair.getPublicKey ('hex'),
      privateKey: keypair.getPrivateKey('hex'),
    });
  }

  getNodePrivateKey(user, key) {
    const token = '308184020100301006072a8648ce3d020106052b8104000a046d306b0201010420';
    const k = Buffer.from(token + key + 'a144034200' + user, 'hex').toString('base64');
    return `-----BEGIN PRIVATE KEY-----\n${k}\n-----END PRIVATE KEY-----`;
  }

  getNodePublicKey(user) {
    const token = '3056301006072a8648ce3d020106052b8104000a034200';
    const k = Buffer.from(token + user,  'hex').toString('base64');
    return `-----BEGIN PUBLIC KEY-----\n${k}\n-----END PUBLIC KEY-----`;
  }
};

const wallet = new Wallet
module.exports = wallet
