const janus = require('janus');

require('./wallet.test');
require('./block.test');
require('./blockchain.test');
require('./state.test');
require('./transaction.test');

janus.report();
