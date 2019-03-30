import janus6 from 'janus6';
import { verify } from 'janus6';
import { createSign, createVerify } from 'crypto';
import sign from './helpers/sign';
import certify from './helpers/certify';
import Wallet from '../src/wallet'
import Transaction from '../src/transaction'
import Block from '../src/block'
import State from '../src/state'

let cesWallet = new Wallet()
let lucWallet = new Wallet()
const ces = cesWallet.create();
const luc = lucWallet.create();

const blockchain = [];

let state = new State();

state = state.with(new Block({miner: 'ces'}));

janus6.group('State', () => {
  janus6.group('method: with', () => {
    janus6.check('In this State ces balance after transaction is 10', () => {
      state = state.with(new Transaction({from: 'ces', to: 'luc', value: 40, nonce: 0}));
      verify.same(state['wallets']['ces']['value'], 10);
    })
    janus6.check('In this State ces balance after transaction is 30', () => {
      state = state.with(new Transaction({from: 'luc', to: 'ces', value: 20, nonce: 0}));
      verify.same(state['wallets']['ces']['value'], 30);
    })
  })
});
