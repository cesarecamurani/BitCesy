const { verify, check, xcheck, group, beforeAll } = require('janus');
const { createSign, createVerify } = require('crypto');
const sign = require('./helpers/sign');
const certify = require('./helpers/certify');
const wallet = require('../src/wallet');
const transaction = require('../src/transaction');

const ces = wallet.create();
const luc = wallet.create();

group('Transaction', () => {
  group('method: sign', () => {
    check('Order has a valid signature', () => {
      const orderOne = 'send mille lire from cesare to luca';
      const orderOneIssuer = ces.publicKey;
      const orderOneSignature = sign(orderOne, orderOneIssuer, ces.privateKey);
      verify.isTrue(certify(orderOne, orderOneIssuer, orderOneSignature));
    })
    check('Order has a fraud signature', () => {
      const orderTwo = 'send mille lire from cesare to luca';
      const orderTwoIssuer = ces.publicKey;
      const orderTwoSignature = sign(orderTwo, orderTwoIssuer, luc.privateKey);
      verify.isFalse(certify(orderTwo, orderTwoIssuer, orderTwoSignature));
    })
  });
});
