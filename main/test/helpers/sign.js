import { createSign, createVerify } from 'crypto';
import Wallet from '../../src/wallet';

const wallet = new Wallet();

const sign = (data, publicKey, privateKey) => {
  const cert = wallet.getNodePrivateKey(publicKey, privateKey);
  return createSign('SHA256').update(data).sign(cert, 'hex');
};
export default sign
