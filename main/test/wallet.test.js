const { verify, check, xcheck, group, beforeAll } = require('janus6');
const { createSign, createVerify } = require('crypto');
const sign = require('./helpers/sign');
const certify = require('./helpers/certify');
const { Wallet } = require('../src/wallet');

const ces = Wallet.create();
const luc = Wallet.create();

group('Wallet', () => {
  group('method: createVerify', () => {
    check('Return true for correct data signature', () => {
      const dataToSign = 'some data to sign';
    	const privateKey = Wallet.getNodePrivateKey(ces.publicKey, ces.privateKey);
      const publicKey = Wallet.getNodePublicKey(ces.publicKey);
      const signature = createSign('SHA256').update(dataToSign).sign(privateKey, 'hex');
      const isValid = createVerify('SHA256').update(dataToSign).verify(publicKey, signature, 'hex');
      verify.isTrue(isValid);
    });
    check('Return false for wrong data signature', () => {
      const dataToSign = 'some data to sign';
	    const privateKey = Wallet.getNodePrivateKey(ces.publicKey, luc.privateKey);
      const publicKey = Wallet.getNodePublicKey(ces.publicKey);
      const signature = createSign('SHA256').update(dataToSign).sign(privateKey, 'hex');
      const isValid = createVerify('SHA256').update(dataToSign).verify(publicKey, signature, 'hex');
      verify.isFalse(isValid);
    });
  });
});
