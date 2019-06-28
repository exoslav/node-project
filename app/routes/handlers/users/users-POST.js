const db = require('../../../lib/data');
const helpers = require('../../../lib/helpers');
const { createResponseObject } = require('../../routes');

const usersPOST = async (
  data = { payload: {} },
  callbackFn = () => {},
  userValidation = validateUserData,
  createResponse = createResponseObject
) => {
  const { USERS_DIRNAME } = require('./users');

  if (userValidation(data.payload)) {
    const phone = data.payload.phone.trim();
    const userName = data.payload.userName.trim();
    const firstName = data.payload.firstName.trim();
    const lastName = data.payload.lastName.trim();
    const password = helpers.hash(data.payload.password.trim());

    try {
      await db.read(USERS_DIRNAME, phone);
      return callbackFn(createResponse(500, { text: 'User already exists.' }));
    } catch(err) {
      console.log(`User with phone number ${phone} was not found. User will be created.`);
    }

    try {
      const userData = { userName, firstName, lastName, password, phone };
      await db.create(USERS_DIRNAME, phone, userData);
    } catch(err) {
      return callbackFn(createResponse(500, { text: 'Error when creating new user.' }))
    }

    return callbackFn(createResponse(200, { text: 'User created.' }));
  } else {
    return callbackFn(createResponse(500, { text: `Unable to create a new user. Invalid input given.` }));
  }
};

function validateUserData(userData = {}, validatePhoneNb = validatePhoneNumber) {
  const { userName, firstName, lastName, password, phone } = userData;

  return (
    validatePhoneNb(phone) &&
    typeof firstName === 'string' && firstName.trim().length > 0 &&
    typeof lastName === 'string' && lastName.trim().length > 0 &&
    typeof userName === 'string' && userName.trim().length > 0 &&
    typeof password === 'string' && password.trim().length > 5

  )
}

function validatePhoneNumber(phone) {
  return typeof phone === 'string' && phone.trim().length === 9;
}

module.exports = usersPOST;
