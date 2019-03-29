const { verify, check, xcheck, group, beforeAll } = require('janus');
const { createSign, createVerify } = require('crypto');
const sign = require('./helpers/sign');
const certify = require('./helpers/certify');
const { Wallet } = require('../src/wallet');
const { Transaction } = require('../src/transaction');
const { Block } = require('../src/block');
const { State } = require('../src/state');
const { Blockchain } = require('../src/blockchain');

const ces = Wallet.create();
const luc = Wallet.create();

const chain = new Blockchain();
chain.mine(ces.publicKey);

group('Blockchain', () => {
  group('method: mine', () => {
    check('After mining genesis block ces balance should be 100', () => {
      verify.same(chain.balance(ces.publicKey), 100);
    })
    check('After mining genesis block luc balance should be 0', () => {
      verify.same(chain.balance(luc.publicKey), 0);
    })
  })
});
