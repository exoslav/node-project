const crypto = require('crypto');
const config = require('../configuration');

const helpers = {};

helpers.hash = (str) => {
  if (typeof str === 'string' && str.trim().length > 0) {
    return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
  }

  return '';
}

helpers.parseStringToJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch(err) {
    console.error(`Error when parsing JSON:, ${err}`);
    return {};
  }
}

helpers.getRandomString = (strLength = 0) => {
  let result = '';
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < strLength; i++) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return result;
}

module.exports = helpers;
