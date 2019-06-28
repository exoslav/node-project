const PROD = process.env.NODE_ENV === 'prod';

const config = {
  httpPort: PROD ? 5000 : 3000,
  httpsPort: PROD ? 5001 : 3001,
  envName: PROD ? 'production' : 'development',
  hashingSecret: 'hashing_secret',
  tokens: {
    length: 20,
    expiration: 1000 * 60 * 60
  }
};

module.exports = config;
