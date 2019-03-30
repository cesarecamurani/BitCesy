import { createSign, createVerify } from 'crypto';
import Wallet from '../../src/wallet';

const wallet = new Wallet();

const certify = (data, publicKey, signature) => {
  const cert = wallet.getNodePublicKey(publicKey);
  return createVerify('SHA256').update(data).verify(cert, signature, 'hex');
};
export default certify
