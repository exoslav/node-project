const config = require('../../../configuration');
const db = require('../../../lib/data');
const helpers = require('../../../lib/helpers');
const { createResponseObject } = require('../../routes');

const tokensPOST = async (
  data = { payload: {} },
  callbackFn = () => {},
  createResponse = createResponseObject
) => {
  const { TOKENS_DIRNAME } = require('./tokens');
  const { USERS_DIRNAME } = require('../users/users');

  const { payload } = data;
  const phone = typeof payload.phone === 'string' && payload.phone.trim().length > 5 ? payload.phone : '';
  const password = typeof payload.password === 'string' && payload.password.trim().length > 5 ? payload.password : '';

  if (!phone || !password) {
    callbackFn(createResponse(400, { text: 'Invalid input of password or phone number.' }));
  }

  let userData = null;

  try {
    userData = await db.read(USERS_DIRNAME, phone);
  } catch (err) {
    callbackFn(createResponse(400, { text: `User with phone '${phone}' not found.` }));
  }

  if (userData.password !== helpers.hash(password)) {
    callbackFn(createResponse(400, { text: 'Invalid password provided.' }));
  }

  const tokenId = helpers.getRandomString(config.tokens.length);
  const expiration = Date.now() + config.tokens.expiration;

  const token = {
    phone: phone,
    expiration: expiration,
    tokenId: tokenId
  };

  try {
    await db.create(TOKENS_DIRNAME, tokenId, token);
    callbackFn(createResponse(200, { token: token }));
  } catch (err) {
    callbackFn(createResponse(500, { text: `Cannot create token.` }));
  }
}

module.exports = tokensPOST;
