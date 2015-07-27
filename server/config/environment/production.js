'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP ||
  process.env.IP ||
  undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT ||
  process.env.PORT ||
  8080,

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
    'mongodb://localhost/nearbytweetreactive'
  },
  twit: {
    consumer_key: process.env.consumer_key
    , consumer_secret: process.env.consumer_key.consumer_secret
    , access_token: process.env.consumer_key.consumer_secret.access_token
    , access_token_secret: process.env.consumer_key.consumer_secret.access_token_secret
  },
  google_api_key: process.env.google_api_key
};