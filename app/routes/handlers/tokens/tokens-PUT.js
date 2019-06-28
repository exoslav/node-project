const config = require('../../../configuration');
const db = require('../../../lib/data');
const { createResponseObject } = require('../../routes');

usersPUT = async (
  data = { payload: {} },
  callbackFn = () => {},
  createResponse = createResponseObject
) => {
  const { payload } = data;
  const tokenId = typeof payload.tokenId === 'string' && payload.tokenId.length === config.tokens.length ? payload.tokenId : '';
  const extend = payload.extend === true;

  if (!tokenId || !extend) {
    return callbackFn(createResponse(400, `Invalid tokenId or extend value given. Given '${tokenId} tokenId and ${extend} extend value.'`));
  }

  let token = null;
  const { TOKENS_DIRNAME } = require('./tokens');

  try {
    token = await db.read(TOKENS_DIRNAME, tokenId);
  } catch(err) {
    return callbackFn(createResponse(500, `Cannot update token, token '${tokenId}' not found.`));
  }

  const tokenCopy = { ...token };

  if (token.expiration > Date.now()) {
    tokenCopy.expiration = Date.now() + config.tokens.expiration;

    try {
      await db.update(TOKENS_DIRNAME, tokenId, tokenCopy);
      return callbackFn(createResponse(200, `Token updated.`));
    } catch(err) {
      return callbackFn(createResponse(500, `Cannot update token '${tokenId}'.`));
    }
  }

  return callbackFn(createResponse(500, `Token '${tokenId}' already expired.`));
}

module.exports = usersPUT;
