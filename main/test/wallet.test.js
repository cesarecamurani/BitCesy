import janus6 from 'janus6';
import { verify } from 'janus6';
import { createSign, createVerify } from 'crypto';

import Wallet from '../src/wallet'
import Transaction from '../src/transaction'
import Block from '../src/block'

let cesWallet = new Wallet()
let lucWallet = new Wallet()
let ces = cesWallet.create();
let luc = lucWallet.create();

janus6.group('Wallet', () => {
  janus6.group('method: createVerify', () => {
    janus6.check('Return true for correct data signature', () => {
      let dataToSign = 'some data to sign';
    	let privateKey = cesWallet.getNodePrivateKey(ces.publicKey, ces.privateKey);
      let publicKey = cesWallet.getNodePublicKey(ces.publicKey);
      let signature = createSign('SHA256').update(dataToSign).sign(privateKey, 'hex');
      let isValid = createVerify('SHA256').update(dataToSign).verify(publicKey, signature, 'hex');
      verify.isTrue(isValid);
    });
    janus6.check('Return false for wrong data signature', () => {
      let dataToSign = 'some data to sign';
	    let privateKey = cesWallet.getNodePrivateKey(ces.publicKey, luc.privateKey);
      let publicKey = cesWallet.getNodePublicKey(ces.publicKey);
      let signature = createSign('SHA256').update(dataToSign).sign(privateKey, 'hex');
      let isValid = createVerify('SHA256').update(dataToSign).verify(publicKey, signature, 'hex');
      verify.isFalse(isValid);
    });
  });
});
