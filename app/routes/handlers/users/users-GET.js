const db = require('../../../lib/data');
const { USERS_DIRNAME } = require('./users');
const { createResponseObject } = require('../../routes');

usersGET = async (
  data = { query: {} },
  callbackFn = () => {},
  createResponse = createResponseObject
) => {
  const userId = data.query.userId;

  if (!userId) {
    return callbackFn(createResponse(400, { text: 'No userId was given.' }));
  }

  try {
    const user = await db.read(USERS_DIRNAME, userId);
    delete user.password;
    return callbackFn(createResponse(200, { user: user }));
  } catch (err) {
    return callbackFn(createResponse(404, { text: `User with id '${userId}' not found.` }));
  }
}

module.exports = usersGET;
