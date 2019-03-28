const wallet = require('../../src/wallet');
const { createSign, createVerify } = require('crypto');

const certify = (data, publicKey, signature) => {
  const cert = wallet.getNodePublicKey(publicKey);
  return createVerify('SHA256').update(data).verify(cert, signature, 'hex');
};
module.exports = certify
