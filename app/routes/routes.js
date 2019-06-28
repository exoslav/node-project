const ROUTE_NOT_FOUND = 'routeNotFound';
const USERS_ROUTE = 'users';
const TOKENS_ROUTE = 'tokens';
const PING_ROUTE = 'ping';

const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';

const OK = 'ok';
const NOT_OK = 'not-ok';

const createResponseObject = (statusCode = 200, payload = {}) => ({
  status: statusCode === 200 ? OK : NOT_OK,
  payload: payload,
  statusCode: statusCode
});

const routes = {};

routes[PING_ROUTE] = (data, callBackFn) => {
  callBackFn(createResponseObject());
};

routes[USERS_ROUTE] = (data, callBackFn) => {
  const methods = [GET, POST, PUT, DELETE];

  if (methodChecker(data.method, methods)) {
    require(`./handlers/users/${USERS_ROUTE}`).handlers[data.method](data, callBackFn);
  } else {
    console.log(`Requesting ${USERS_ROUTE} path with invalid method. Only following methods are allowed: ${methods.join(', ')}`);
    callBackFn(createResponseObject(500));
  }
};

routes[TOKENS_ROUTE] = (data, callBackFn) => {
  const methods = [GET, POST, PUT, DELETE];

  if (methodChecker(data.method, methods)) {
    require(`./handlers/tokens/${TOKENS_ROUTE}`).handlers[data.method](data, callBackFn);
  } else {
    console.log(`Requesting ${TOKENS_ROUTE} path with invalid method. Only following methods are allowed: ${methods.join(', ')}`);
    callBackFn(createResponseObject(500));
  }
};

routes[ROUTE_NOT_FOUND] = (data, callBackFn) => {
  callBackFn(createResponseObject());
};

module.exports = {
  routes: routes,
  PING_ROUTE: PING_ROUTE,
  USERS_ROUTE: USERS_ROUTE,
  ROUTE_NOT_FOUND: ROUTE_NOT_FOUND,
  GET: GET,
  POST: POST,
  PUT: PUT,
  DELETE: DELETE,
  OK: OK,
  NOT_OK: NOT_OK,
  createResponseObject: createResponseObject
};

function methodChecker(requiredMethod, availableMethods = []) {
  return availableMethods.indexOf(requiredMethod) >= 0;
}
