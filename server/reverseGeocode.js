var Q = require("Q");
var request = require("request");
var googleApiKey = require("./config/environment").google_api_key;
var format = "https://maps.googleapis.com/maps/api/geocode/json?latlng={{latlng}}&key=" + googleApiKey;
var _ = require("lodash");

module.exports = function (latlng) {
	var url = format.replace("{{latlng}}", latlng);	
	var deferred = Q.defer();
	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		  var results = JSON.parse(body).results;
		  
		  var mostAccurateResult = _.max(results, function(result){
			  return result.formatted_address.length;
		  }).formatted_address;
		  
		  deferred.resolve(mostAccurateResult);
	  } else {
		  deferred.reject(error);
	  }
	});	
	
	return deferred.promise;
}