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
    consumer_key:         'qUrbMzCaig1RAuY5rGnNSjtUg'
    , consumer_secret:      '8CKyVTb9WDrXn7u9038W521nPeXCoCDRTKcLN1GR9KyviCJ2Gw'
    , access_token:         '140354657-967IYAJAJqSBkSciPIJZXoYjtoczcuacgrlkotc5'
    , access_token_secret:  'IMt97X6pIOvNkeXuKC4YlfxRkSKuduyuAXQPaOc4QvRQo'
  }
};
