const config = require('../../../configuration');
const db = require('../../../lib/data');
const { createResponseObject } = require('../../routes');

usersDELETE = async (
  data = { query: {} },
  callbackFn = () => {}
) => {
  const { query } = data;
  const tokenId = typeof query.tokenId === 'string' && query.tokenId.length === config.tokens.length ? query.tokenId : '';

  if (!tokenId) {
    return callbackFn(createResponseObject(400, { text: `Invalid token '${tokenId}' given.` }));
  }

  const { TOKENS_DIRNAME } = require('./tokens');

  try {
    await db.delete(TOKENS_DIRNAME, tokenId);
    callbackFn(createResponseObject(200, { text: `Token '${tokenId} 'deleted.` }));
  } catch(err) {
    callbackFn(createResponseObject(500, { text: `Error when deleting token '${tokenId}'.` }));
  }
}

module.exports = usersDELETE;
