const { verify, check, xcheck, group, beforeAll } = require('janus6');
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

group('Blockchain', () => {
  group('method: mine', () => {
    group('before transaction', () => {
      check('After mining genesis block ces balance should be 50', () => {
        chain.mine(ces.publicKey);
        verify.same(chain.balance(ces.publicKey), 50);
      })
      check('After mining genesis block luc balance should be 0', () => {
        verify.same(chain.balance(luc.publicKey), 0);
      })
    })
    group('after transaction', () => {
      check('After mining 2nd block (with transaction) ces balance should be 35', () => {
        chain.mine(ces.publicKey, [
            new Transaction({
                from: ces.publicKey,
                to: luc.publicKey,
                value: 15,
                nonce: 0,
            }).sign(ces.privateKey),
        ]);
        verify.same(chain.balance(ces.publicKey), 85);
      })
      check('After mining 2nd block (with transaction) luc balance should be 15', () => {
        verify.same(chain.balance(luc.publicKey), 15);
      })
    })
  })
});
