// Copyright 2012 Peter Potrebic.  All rights reserved.

var restify = require('restify');

exports.createCampfireAPI = function (options) {
    var that = {};

    // privates
    var api = options.api;      // dependency injection for testing
    if (!api) {
        restify.createJsonClient({
            url:'https://' + options.campfireName + '.campfirenow.com'
        });
        api.basicAuth(options.apiToken, 'x');
    }

    var assertIsInt = function isInt(value, label) {
        if (!label) {
            label = 'roomId';
        }
        if (typeof value === 'string') {
            value = parseInt(value);
        }
        if (!((typeof value === 'number') && (value % 1 === 0))) {
            throw new TypeError(label + ' must be an integer');
        }
    }

    var assertIsString = function isInt(value, label) {
        if (typeof value !== 'string') {
            throw new TypeError(label + ' must be a string');
        }
    }

    var assertIsStringOrNull = function isInt(value, label) {
        if (value) {
            assertIsString(value, label);
        }
    }

    // helper to build a string, uses "hello {0}, my name is {1}" style
    var format = function format(formatString) {
        var formatted = formatString;
        for (var i = 0, argIndx = 1; argIndx < arguments.length; i++, argIndx++) {
            var arg = arguments[argIndx].toString();
            arg = encodeURIComponent(arg);
            var regexp = new RegExp('\\{'+i+'\\}', 'gi');
            formatted = formatted.replace(regexp, arg);
        }
        return formatted;
    };

    var composeURI = function composeURI() {
        var uri = format.apply(null, arguments);
        uri = '/' + uri + '.json';
        return uri;
    }

    var instantMessage = function instantMessage(roomId, payload, messageType, callback) {
        assertIsInt(roomId);
        assertIsString(payload, "payload");
        var uri = composeURI('room/{0}/speak', roomId);

        var body = {
            message: {
                type: messageType,
                body: payload
            }
        }

        execute(poster(uri, body), callback);
    }

    // for use by all GET requests
    var getter = function getter(uri) {
        return function(handler) {
            api.get(uri, handler);
        }
    }

    // for use by all PUT requests
    var putter = function putter(uri, object) {
        if (object === undefined) object = null;    // restify accepts 'null' bodies, but not undefined

        return function(handler) {
            api.put(uri, object, handler);
        }
    }

    // for use by all POST requests
    var poster = function poster(uri, object) {
        if (object === undefined) object = null;    // restify accepts 'null' bodies, but not undefined

        return function(handler) {
            api.post(uri, object, handler);
        }
    }

    // for use by all DELETE requests
    var deleter = function putter(uri) {
        return function(handler) {
            api.del(uri, handler);
        }
    }

    var execute = function execute(doer, callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('callback must be a function');
        }

        // the 'doer' function is the function returned by one of 'getter', 'putter', 'poster', or 'deleter'
        doer(function(error, request, response, body) {
                callback(body || error, response, error);
            });
    }
    // End of Privates

    // Public API

    // public GET info on all 'rooms' API
    that.rooms = function(callback) {
        var uri = composeURI('rooms');
        execute(getter(uri), callback);
    };

    // --- Single Room APIs ----
    // public GET info on single 'room' API
    that.room = function(roomId, callback) {
        assertIsInt(roomId);

        var uri = composeURI('room/{0}', roomId);
        execute(getter(uri), callback);
    };

    // public Update 'room' API, either topic or name
    that.room.update = function(roomId, topic, name, callback) {
        assertIsInt(roomId);
        assertIsStringOrNull(topic, "topic");
        assertIsStringOrNull(name, "name");

        var body = { room: {} };

        if (topic !== null) {
            if (topic === '') {
                topic = null;           // this will remove any current topic
            }
            body.room.topic = topic;
        }
        if (name !== null) {
            body.room.name = name;
        }

        var uri = composeURI('room/{0}', roomId);
        execute(putter(uri, body), callback);
    };

    // public PRESENCE (join or leave) 'room' API
    that.room.presence = function(roomId, isPresent, callback) {
        assertIsInt(roomId);

        var uri = composeURI('room/{0}/{1}', roomId, isPresent ? 'join' : 'leave');
        execute(poster(uri), callback);
    };

    // public LOCK or UNLOCK 'room' API
    that.room.lock = function(roomId, isLocked, callback) {
        assertIsInt(roomId);

        var uri = composeURI('room/{0}/{1}', roomId, isLocked ? 'lock' : 'unlock');
        execute(poster(uri), callback);
    };


    // -- Account APIs --
    that.account = function(callback) {
        var uri = composeURI('account');
        execute(getter(uri), callback);
    };


    // -- Search APIs --
    that.search = function(searchTerm, callback) {
        var uri = composeURI('search/{0}', searchTerm);
        execute(getter(uri), callback);
    };


    // -- Messages APIs --

    that.room.postTextMessage = function(roomId, message, callback) {
        instantMessage(roomId, message, "TextMessage", callback)
    };

    that.room.pasteMessage = function(roomId, pasteData, callback) {
        instantMessage(roomId, pasteData, "PasteMessage", callback)
    };

    that.room.tweetMessage = function(roomId, tweetUrl, callback) {
        instantMessage(roomId, tweetUrl, "TweetMessage", callback)
    };

    that.room.playSound = function(roomId, soundName, callback) {
        instantMessage(roomId, soundName, "SoundMessage", callback)
    };

    return that;
}