const wallet = require('../../src/wallet');
const { createSign, createVerify } = require('crypto');

const sign = (data, publicKey, privateKey) => {
  const cert = wallet.getNodePrivateKey(publicKey, privateKey);
  return createSign('SHA256').update(data).sign(cert, 'hex');
};

module.exports = sign
