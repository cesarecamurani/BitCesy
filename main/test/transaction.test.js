import janus6 from 'janus6';
import { verify } from 'janus6';
import {createSign, createVerify} from 'crypto';
import Wallet from '../src/wallet'
import Transaction from '../src/transaction'
import Block from '../src/block'

let cesWallet = new Wallet()
let lucWallet = new Wallet()
const ces = cesWallet.create();
const luc = lucWallet.create();

const transactionOne = new Transaction({
    from:  ces.publicKey,
    to:    luc.publicKey,
    nonce: 0,
    value: 15,
}).sign(ces.privateKey);

const transactionTwo = new Transaction({
    from:  ces.publicKey,
    to:    luc.publicKey,
    nonce: 0,
    value: 15,
});

const transactionThree = new Transaction({
    from:  ces.publicKey,
    to:    luc.publicKey,
    nonce: 0,
    value: 15,
}).sign(luc.privateKey);;

janus6.group('Transaction', () => {
  janus6.group('method: certify', () => {
    janus6.check('Valid transaction', () => {
      verify.isTrue(transactionOne.certify());
    })
    janus6.check('Invalid transaction because of no signature', () => {
      verify.isFalse(transactionTwo.certify());
    });
    janus6.check('Invalid transaction because of fraud signature', () => {
      verify.isFalse(transactionThree.certify());
    });
  });
});
