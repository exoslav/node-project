const db = require('../../../lib/data');
const { USERS_DIRNAME } = require('./users');
const { createResponseObject } = require('../../routes');

usersPUT = async (
  data = { payload: {} },
  callbackFn = () => {},
  createResponse = createResponseObject
) => {
  const { payload } = data;

  if (!validatePhoneNumber(payload.phone, 9)) {
    return callbackFn(createResponse(400, { text: 'Invalid phone number was given.' }));
  }

  if (!userUpdateDataValid(data.payload)) {
    return callbackFn(createResponse(400, { text: 'Invalid inputs for updating user.' }));
  }

  let currentData = {};
  const userName = inputChecker(payload.userName);
  const firstName = inputChecker(payload.firstName);
  const lastName = inputChecker(payload.lastName);
  const password = inputChecker(payload.password);

  try {
    currentData = await db.read(USERS_DIRNAME, payload.phone);
  } catch(err) {
    return callbackFn(createResponse(500, `Cannot update user '${payload.phone}', cannot read a file.`));
  }

  const newData = { ...currentData };

  if (userName) {
    newData.userName = userName;
  }

  if (firstName) {
    newData.firstName = firstName;
  }

  if (lastName) {
    newData.lastName = lastName;
  }

  if (password) {
    newData.password = password;
  }

  try {
    await db.update(USERS_DIRNAME, payload.phone, newData);
    return callbackFn(createResponse(200, { text: 'User was updated' }));
  } catch(err) {
    return callbackFn(createResponse(500, `Unable to update user '${phone}'.`));
  }
}

function inputChecker(input, length = 0) {
  return typeof input === 'string' && input.trim().length > length ? input.trim() : '';
}

function validatePhoneNumber(phone) {
  return typeof phone === 'string' && phone.trim().length === 9;
}

function userUpdateDataValid(userData = {}) {
  const { userName, firstName, lastName, password } = userData;

  return (
    typeof firstName === 'string' && firstName.trim().length > 0 ||
    typeof lastName === 'string' && lastName.trim().length > 0 ||
    typeof userName === 'string' && userName.trim().length > 0 ||
    typeof password === 'string' && password.trim().length > 5
  )
}

module.exports = usersPUT;
