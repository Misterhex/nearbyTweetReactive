var Rx = require('rx');
var Twit = require('twit');
var sentiment = require('sentiment');
var twitConfig = require("./config/environment").twit;
var T = new Twit(twitConfig);
var moment = require("moment");
var last;
var reverseGeocode = require("./reverseGeocode");

var published = Rx.Observable.create(function (observer) {
    T.get('search/tweets', { geocode: "1.3525272,103.9448637,42km" }, 
        function (err, data, response) {
            if (err)
                observer.onError(err);
            else {
                observer.onNext(data);
                observer.onCompleted();
            }
            return function () {
                // do nothing
            }
        });
    })
    .delay(3000)
    .repeat()
    .retry()
    .selectMany(function (response) {
        if (response)
            return response.statuses;
        else
            return [];
    })
    .filter(function (status) {
        return status.place && status.place.country_code === "SG" && status.coordinates.coordinates.length === 2;
    })
    .distinct(function (status) {
        return status.id;
    })
    .selectMany(function (status) {

        var latlng = status.coordinates.coordinates[1] +"," + status.coordinates.coordinates[0];

        return reverseGeocode(latlng).then(function (location) {
            return {
                "created_at": moment(status.created_at).format('MMMM Do YYYY, h:mm:ss a'),
                "text": status.text,
                "sentiment": sentiment(status.text),
                "screen_name": status.user.screen_name,
                "latlng": latlng,
                "location": location,
                "profile_image_url": status.user.profile_image_url
            };
        });
    })
    .filter(function (tweet) {

        function allTrue(obj) {
            for (var o in obj)
                if (!obj[o]) return false;

            return true;
        }

        return allTrue(tweet);
    })
    .doOnNext(function (t) {
        last = t;
    })
    .publishValue(last)
    .refCount();


module.exports = published;