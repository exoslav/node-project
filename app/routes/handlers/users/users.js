const { GET, POST, PUT, DELETE } = require('../../routes');

const USERS_DIRNAME = 'users';

const handlers = {
  [POST]: require(`./users-${POST}`),
  [GET]: require(`./users-${GET}`),
  [PUT]: require(`./users-${PUT}`),
  [DELETE]: require(`./users-${DELETE}`)
};

module.exports = {
  USERS_DIRNAME: USERS_DIRNAME,
  handlers: handlers
};
