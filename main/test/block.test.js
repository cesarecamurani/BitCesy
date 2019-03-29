const { verify, check, xcheck, group, beforeAll } = require('janus');
const { createSign, createVerify } = require('crypto');
const sign = require('./helpers/sign');
const certify = require('./helpers/certify');
const { Wallet } = require('../src/wallet');
const { Transaction } = require('../src/transaction');
const { Block } = require('../src/block');

const ces = Wallet.create();
const luc = Wallet.create();

const blockchain = [];

// First Block pushed into the blockchain
blockchain.push(
    new Block({
        parentHash:   null,
        stateHash:    null,
        miner:        ces.publicKey,
        transactions: [],
    }).mine(),
);

// Second Block pushed into the blockchain
blockchain.push(
    new Block({
        parentHash:   blockchain[blockchain.length - 1].hash(),
        stateHash:    null,
        miner:        ces.publicKey,
        transactions: [
            new Transaction({
                from:  ces.publicKey,
                to:    luc.publicKey,
                value: 15,
                nonce: 0,
            }).sign(ces.privateKey),
        ],
    }).mine(),
);

group('Block', () => {
  group('method: mine', () => {
    check('First block hash begins with a double zero', () => {
      verify.same(blockchain[0].hash().substr(0, 2), "00");
    })
    check('Second block hash begins with a double zero', () => {
      verify.same(blockchain[1].hash().substr(0, 2), "00");
    })
  })
});
