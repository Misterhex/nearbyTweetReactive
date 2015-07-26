'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/nearbytweetreactive-dev'
  },

  seedDB: true,
  twit: {
    consumer_key:         process.env.consumer_key
    , consumer_secret:      process.env.consumer_secret
    , access_token:         process.env.access_token
    , access_token_secret:  process.env.access_token_secret
  }
};
