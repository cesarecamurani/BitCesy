import janus6 from 'janus6';
import { verify } from 'janus6';
import { createSign, createVerify } from 'crypto';
import Wallet from '../src/wallet'
import Transaction from '../src/transaction'
import Block from '../src/block'

let cesWallet = new Wallet()
let lucWallet = new Wallet()
const ces = cesWallet.create();
const luc = lucWallet.create();

const blockchain = [];

blockchain.push(
    new Block({
        parentHash:   null,
        stateHash:    null,
        miner:        ces.publicKey,
        transactions: [],
    }).mine(),
);

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

janus6.group('Block', () => {
  janus6.group('method: mine', () => {
    janus6.check('First block hash begins with a double zero', () => {
      verify.same(blockchain[0].hash().substr(0, 2), "00");
    })
    janus6.check('Second block hash begins with a double zero', () => {
      verify.same(blockchain[1].hash().substr(0, 2), "00");
    })
  })
});
