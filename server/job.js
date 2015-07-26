var Rx = require('rx');
var Twit = require('twit');
var sentiment = require('sentiment');

var twitConfig = require("./config/environment").twit;
var T = new Twit(twitConfig);

var intervalPeriod = 3000;

module.exports = function(socketio) {
      
    return Rx.Observable.create(function (observer) {
        T.get('search/tweets', { geocode: "1.3525272,103.9448637,42km"}, function(err, data, response) {
            if (err)
                observer.onError(err);
            else {
                observer.onNext(data);
                observer.onCompleted();    
            }
        });
    
        // Note that this is optional, you do not have to return this if you require no cleanup
        return function () {
            console.log('disposedd');
        };
    })
    .delay(5000)
    .repeat()
    .retry()
    .selectMany(function(response){
        return response.statuses;
    })
    .filter(function(status){
       return status.place && status.place.country_code === "SG";
    })
    .distinct(function(status){
        return status.id;
    })
    .map(function(status){
        
        return {
            "created_at" : status.created_at,
            "text": status.text,
            "sentiment": sentiment(status.text),
            "screen_name": status.user.screen_name
        };
    })
    .filter(function(tweet){
        
        function allTrue(obj)
        {
          for(var o in obj)
              if(!obj[o]) return false;
        
          return true;
        }
        
        return allTrue(tweet);
    })
    .subscribe(
        function (x) {
          console.log('Next: %j', x);
          
          socketio.emit('tweet:new', x);
        },
        function (err) {
            console.log('Error: ' + err);
        },
        function () {
            console.log('Completed');
    	});	
};
