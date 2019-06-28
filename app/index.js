const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;

const config = require('./configuration');
const { routes, ROUTE_NOT_FOUND } = require('./routes/routes');
const { OK } = require('./routes/routes');
const { parseStringToJSON } = require('./lib/helpers');

const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
};

const httpServer = http.createServer((req, res) => {
  unifyServers(req, res);
});

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifyServers(req, res);
});


httpServer.listen(config.httpPort, () => {
  console.log(`Server is running on port:${config.httpPort} on ${config.envName} environment.`);
});

httpsServer.listen(config.httpsPort, () => {
  console.log(`Server is running on port:${config.httpsPort} on ${config.envName} environment.`);
});


const unifyServers = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const method = req.method.toUpperCase();
  const queryString = parsedUrl.query;
  const headers = req.headers;

  let reqBody = '';
  const decoder = new StringDecoder('utf-8');

  req.on('data', (data) => {
    reqBody += decoder.write(data);
  });

  req.on('end', () => {
    reqBody += decoder.end();

    const currentRouteHandler = routes[trimmedPath]
      ? routes[trimmedPath]
      : routes[ROUTE_NOT_FOUND];

    const data = {
      pathname: trimmedPath,
      method: method,
      headers: JSON.stringify(headers),
      query: queryString,
      payload: parseStringToJSON(reqBody)
    };

    currentRouteHandler(data, ({ statusCode = 200, status = OK, payload = {} }) => {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(JSON.stringify({
        statusCode: statusCode,
        status: status,
        payload: payload
      }, null, 2));
    });

    /*
    console.log(`
      REQUEST:
        pathname: ${trimmedPath}
        method: ${method}
        headers: ${JSON.stringify(headers)}
        query: ${JSON.stringify(queryString)}
    `);
    */
  });
};
