const db = require('../../../lib/data');
const { USERS_DIRNAME } = require('./users');
const { createResponseObject } = require('../../routes');

usersDELETE = async (
  data = { payload: {} },
  callbackFn = () => {}
) => {
  const phone = data.payload.phone.trim();

  if (!validatePhoneNumber(phone)) {
    return callbackFn(createResponseObject(500, { text: `Unable to DELETE user '${phone}'. Invalid phone given.` }));
  }

  try {
    await db.delete(USERS_DIRNAME, phone);
    callbackFn(createResponseObject(200, { text: `User '${phone} 'deleted.` }));
  } catch(err) {
    callbackFn(createResponseObject(500, { text: `Error when deleting user '${phone}'.` }));
  }
}

function validatePhoneNumber(phone) {
  return typeof phone === 'string' && phone.trim().length === 9;
}

module.exports = usersDELETE;
