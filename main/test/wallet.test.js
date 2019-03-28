const { verify, check, xcheck, group, beforeAll } = require('janus');
const { createSign, createVerify } = require('crypto');
const sign = require('./helpers/sign');
const certify = require('./helpers/certify');
const wallet = require('../src/wallet');

const ces = wallet.create();
const luc = wallet.create();

group('Wallet', () => {
  group('method: createVerify', () => {
    check('Return true for correct data signature', () => {
      const dataToSign = 'some data to sign';
    	const privateKey = wallet.getNodePrivateKey(ces.publicKey, ces.privateKey);
      const publicKey = wallet.getNodePublicKey(ces.publicKey);
      const signature = createSign('SHA256').update(dataToSign).sign(privateKey, 'hex');
      const isValid = createVerify('SHA256').update(dataToSign).verify(publicKey, signature, 'hex');
      verify.isTrue(isValid);
    });
    check('Return false for wrong data signature', () => {
      const dataToSign = 'some data to sign';
	    const privateKey = wallet.getNodePrivateKey(ces.publicKey, luc.privateKey);
      const publicKey = wallet.getNodePublicKey(ces.publicKey);
      const signature = createSign('SHA256').update(dataToSign).sign(privateKey, 'hex');
      const isValid = createVerify('SHA256').update(dataToSign).verify(publicKey, signature, 'hex');
      verify.isFalse(isValid);
    });
  });
});
