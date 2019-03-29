const { verify, check, xcheck, group, beforeAll } = require('janus6');
const { createSign, createVerify } = require('crypto');
const sign = require('./helpers/sign');
const certify = require('./helpers/certify');
const { Wallet } = require('../src/wallet');
const { Transaction } = require('../src/transaction');
const { Block } = require('../src/block');
const { State } = require('../src/state');

const ces = Wallet.create();
const luc = Wallet.create();

const blockchain = [];

let state = new State();

state = state.with(new Block({miner: 'ces'}));

group('State', () => {
  group('method: with', () => {
    check('In this State ces balance after transaction is 10', () => {
      state = state.with(new Transaction({from: 'ces', to: 'luc', value: 40, nonce: 0}));
      verify.same(state['wallets']['ces']['value'], 10);
    })
    check('In this State ces balance after transaction is 30', () => {
      state = state.with(new Transaction({from: 'luc', to: 'ces', value: 20, nonce: 0}));
      verify.same(state['wallets']['ces']['value'], 30);
    })
  })
});
