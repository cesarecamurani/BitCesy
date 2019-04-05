const {createHash, createECDH, createSign, createVerify} = require('crypto');
const CONFIG = exports.CONFIG = ({BLOCK_DIFFICULTY: 2, BLOCK_REWARD: 50});

class Wallet {

  constructor(opts={}) {
    /*
    Object.assign() copies the values (of all enumerable own properties)
    from one or more source objects to a target object.
    It has a signature of Object.assign(target, ...sources).
    The target object is the first parameter and is also used as the return value.
    */
    Object.assign(this, {
      publicKey: null,
      privateKey: null,
    }, opts);
  }

  create() {
    /*
    The ECDH class is a utility for creating Elliptic Curve Diffie-Hellman (ECDH) key exchanges.
    Instances of the ECDH class can be created using the crypto.createECDH() function.
    secp256k1 refers to the parameters of the elliptic curve used in Bitcoin's public-key cryptography
    */
    const keypair = createECDH('secp256k1');
    /* Generates private and public EC Diffie-Hellman key values,
    and returns the public key in the specified format and encoding
    */
    keypair.generateKeys();
  
    return new Wallet({
      publicKey:  keypair.getPublicKey('hex'),
      privateKey: keypair.getPrivateKey('hex'),
    });

  }
  // encrypts the private key
  getNodePrivateKey(user, key) {
    const t = '308184020100301006072a8648ce3d020106052b8104000a046d306b0201010420';
    /*
    Buffer.from takes the values passed as strings and encode them in hex base
    then .toString convert the result in base64
    */
    const k = Buffer.from(t + key + 'a144034200' + user, 'hex').toString('base64');

    return `-----BEGIN PRIVATE KEY-----\n${k}\n-----END PRIVATE KEY-----`;
  }
  // encrypts the public key
  getNodePublicKey(user) {
    const t = '3056301006072a8648ce3d020106052b8104000a034200';
    /*
    Buffer.from takes the values passed as strings and encode them in hex base
    then .toString convert the result in base64
    */
    const k = Buffer.from(t + user,  'hex').toString('base64');

    return `-----BEGIN PUBLIC KEY-----\n${k}\n-----END PUBLIC KEY-----`;
  }
};
export default Wallet
