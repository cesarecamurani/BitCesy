import janus6 from 'janus6';
import { verify } from 'janus6';
import { createSign, createVerify } from'crypto';
import sign from './helpers/sign';
import certify from './helpers/certify';
import Wallet from '../src/wallet'
import Transaction from '../src/transaction'
import Block from '../src/block'
import State from '../src/state'
import Blockchain from '../src/blockchain'

let cesWallet = new Wallet()
let lucWallet = new Wallet()

let ces = cesWallet.create();
let luc = lucWallet.create();

let chain = new Blockchain();

janus6.group('Blockchain', () => {
  janus6.group('method: mine', () => {
  janus6.group('before transaction', () => {
      janus6.check('After mining genesis block ces balance should be 50', () => {
        chain.mine(ces.publicKey);
        verify.same(chain.balance(ces.publicKey), 50);
      })
      janus6.check('After mining genesis block luc balance should be 0', () => {
        verify.same(chain.balance(luc.publicKey), 0);
      })
    })
    janus6.group('after transaction', () => {
      janus6.check('After mining 2nd block (with transaction) ces balance should be 85', () => {
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
      janus6.check('After mining 2nd block (with transaction) luc balance should be 15', () => {
        verify.same(chain.balance(luc.publicKey), 15);
      })
    })
  })
});
