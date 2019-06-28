const { GET, POST, PUT, DELETE } = require('../../routes');

const TOKENS_DIRNAME = 'tokens';

const handlers = {
  [POST]: require(`./tokens-${POST}`),
  [GET]: require(`./tokens-${GET}`),
  [PUT]: require(`./tokens-${PUT}`),
  [DELETE]: require(`./tokens-${DELETE}`)
};

module.exports = {
  TOKENS_DIRNAME: TOKENS_DIRNAME,
  handlers: handlers
};
