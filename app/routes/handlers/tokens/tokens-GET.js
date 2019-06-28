const config = require('../../../configuration');
const db = require('../../../lib/data');
const { createResponseObject } = require('../../routes');

usersGET = async (
  data = { query: {} },
  callbackFn = () => {},
  createResponse = createResponseObject
) => {
  const { query } = data;
  const tokenId = typeof query.tokenId === 'string' && query.tokenId.length === config.tokens.length ? query.tokenId : '';

  if (!tokenId) {
    return callbackFn(createResponse(400, { text: `Invalid tokenId was given. Given '${query.tokenId}'.` }));
  }

  const { TOKENS_DIRNAME } = require('./tokens');

  try {
    const token = await db.read(TOKENS_DIRNAME, tokenId);
    return callbackFn(createResponse(200, { token: token }));
  } catch (err) {
    return callbackFn(createResponse(404, { text: `Token with id '${tokenId}' not found.` }));
  }
}

module.exports = usersGET;
