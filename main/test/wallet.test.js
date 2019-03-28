const { verify, check, xcheck, group, beforeAll } = require('janus');
const { createSign, createVerify } = require('crypto');
const sign = require('./helpers/sign');
const certify = require('./helpers/certify');
const wallet = require('../src/wallet');

const ces = wallet.create();
const luc = wallet.create();

group('Wallet', () => {

  group('method: crypto.createVerify', () => {
    check('return true for correct data signature', () => {
      const dataToSign = 'some data to sign';
    	const privateKey = wallet.getNodePrivateKey(ces.publicKey, ces.privateKey);
      const publicKey = wallet.getNodePublicKey(ces.publicKey);
      const signature = createSign('SHA256').update(dataToSign).sign(privateKey, 'hex');
      const isValid = createVerify('SHA256').update(dataToSign).verify(publicKey, signature, 'hex');
      verify.isTrue(isValid);
    });
    check('Order has a valid signature', () => {
      const orderOne = 'send mille lire from cesare to luca';
      const orderOneIssuer = ces.publicKey;
      const orderOneSignature = sign(orderOne, orderOneIssuer, ces.privateKey);
      verify.isTrue(certify(orderOne, orderOneIssuer, orderOneSignature));
    })
  });
  group('method: crypto.createVerify', () => {
    check('return false for wrong data signature', () => {
      const dataToSign = 'some data to sign';
	    const privateKey = wallet.getNodePrivateKey(ces.publicKey, luc.privateKey);
      const publicKey = wallet.getNodePublicKey(ces.publicKey);
      const signature = createSign('SHA256').update(dataToSign).sign(privateKey, 'hex');
      const isValid = createVerify('SHA256').update(dataToSign).verify(publicKey, signature, 'hex');
      verify.isFalse(isValid);
    });
  });
});
