var Rx = require('rx');
var Twit = require('twit');
var sentiment = require('sentiment');

var twitConfig = require("./config/environment").twit;
var T = new Twit(twitConfig);

var moment = require("moment");

var last;

var published = Rx.Observable.create(function (observer) {
        T.get('search/tweets', { geocode: "1.3525272,103.9448637,42km" }, function (err, data, response) {
            if (err)
                observer.onError(err);
            else {
                observer.onNext(data);
                observer.onCompleted();
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
        return status.place && status.place.country_code === "SG";
    })
    .distinct(function (status) {
        return status.id;
    })
    .map(function (status) {

        return {
            "created_at": moment(status.created_at).format('MMMM Do YYYY, h:mm:ss a'),
            "text": status.text,
            "sentiment": sentiment(status.text),
            "screen_name": status.user.screen_name
        };
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