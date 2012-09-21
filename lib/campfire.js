// Copyright 2012 Peter Potrebic.  All rights reserved.

var restify = require('restify');
var _und = require("underscore");

/**
 * The main entry point for creating a campfireAPI object.
 * @param options JSON object like this:
 *      var config = {
 *          campfireName: '[name-of-your-campfire]',     // https://name.compfirenow.com
 *          apiToken: '[your-api-token]'
 *      };
 * @return {Object}
 */
exports.createCampfireAPI = function (options) {
    var that = {};

    // privates
    var api = options.api;      // dependency injection for testing
    if (!api) {
        api = restify.createJsonClient({
            url:'https://' + options.campfireName + '.campfirenow.com'
            });
        api.basicAuth(options.apiToken, 'x');
    }
    that.api = api;

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

    var assertIsString = function assertIsString(value, label) {
        if (typeof value !== 'string') {
            throw new TypeError(label + ' must be a string');
        }
    }

    var assertIsStringOrNull = function assertIsStringOrNull(value, label) {
        if (value) {
            assertIsString(value, label);
        }
    }


    var assertIsDate = function isDate(value, label) {
        if (!label) {
            label = 'date';
        }
        if (!(value instanceof Date)) {
            throw new TypeError(label + ' must be an instance of Date');
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

    var composeUri = function composeUri() {
        var uri = format.apply(null, arguments);
        uri = '/' + uri + '.json';
        return uri;
    }

    var composeUriWithQueryParameters = function composeUriWithQueryParameters(baseUri, queryParams) {
        var formatArg = [baseUri];

        // just learning javascript/node. I'm sure there's more elegant way.
        // go from: [1, 2, 3, 4] ==> [1, 3, 4].
        var args = _und.toArray(arguments);
        var minus2 = args.slice(2);
        formatArg = formatArg.concat(minus2);

        var uri = composeUri.apply(null, formatArg);

        var qargs = _und.map(_und.keys(queryParams), function(key)
        {
            var val = queryParams[key];
            var result = null;

            if (val) {
                result = key.toString() + '=' + val;
            }
            return result;
        });

        var qs = _und.filter(qargs, function(s) { return s; }).join('&');

        uri = uri + ((qs.length > 0) ? ('?' + qs) : '');
        return uri;
    }

    var instantMessage = function instantMessage(roomId, payload, messageType, callback) {
        assertIsInt(roomId);
        assertIsString(payload, "payload");
        var uri = composeUri('room/{0}/speak', roomId);

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
            that.api.get(uri, handler);
        }
    }

    // for use by all PUT requests
    var putter = function putter(uri, object) {
        if (object === undefined) object = null;    // restify accepts 'null' bodies, but not undefined

        return function(handler) {
            that.api.put(uri, object, handler);
        }
    }

    // for use by all POST requests
    var poster = function poster(uri, object) {
        if (object === undefined) object = null;    // restify accepts 'null' bodies, but not undefined

        return function(handler) {
            that.api.post(uri, object, handler);
        }
    }

    // for use by all DELETE requests
    var deleter = function deleter(uri) {
        return function(handler) {
            var options = {
                path: uri
                ,headers: {
                    'Content-Length': 0
                }
            }
            that.api.del(options, handler);
        }
    }

    var execute = function execute(doer, callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('callback must be a function');
        }

        // the 'doer' function is the function returned by one of 'getter', 'putter', 'poster', or 'deleter'
        doer(function(error, request, response, body) {
                callback(body, response, error);
            });
    }
    // End of Privates

    // Public API

    /**
     * GET info on all 'rooms' API
     *
     * @param callback(error, request, response, body)
     */
    that.rooms = function(callback) {
        var uri = composeUri('rooms');
        execute(getter(uri), callback);
    };

    // --- Single Room APIs ----
    /**
     * GET info on single 'room'
     * @param {integer} roomId
     * @param {function} callback (error, request, response, body)
     */
    that.room = function(roomId, callback) {
        assertIsInt(roomId);

        var uri = composeUri('room/{0}', roomId);
        execute(getter(uri), callback);
    };

    /**
     * Update the topic and/or name of a 'room'
     *
     * @param {integer} roomId
     * @param {string} topic
     * @param {string} name
     * @param {function} callback (error, request, response, body)
     */
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

        var uri = composeUri('room/{0}', roomId);
        execute(putter(uri, body), callback);
    };

    /**
     * Establish presence (Join) or not (Leave) within a room
     *
     * @param {integer} roomId
     * @param {bool} isPresent
     * @param {function} callback (error, request, response, body)
     */
    that.room.presence = function(roomId, isPresent, callback) {
        assertIsInt(roomId);

        var uri = composeUri('room/{0}/{1}', roomId, isPresent ? 'join' : 'leave');
        execute(poster(uri), callback);
    };

    /**
     * Lock or unlock a room
     * @param {integer} roomId
     * @param {bool} isLocked
     * @param {function} callback (error, request, response, body)
     */
    that.room.lock = function(roomId, isLocked, callback) {
        assertIsInt(roomId);

        var uri = composeUri('room/{0}/{1}', roomId, isLocked ? 'lock' : 'unlock');
        execute(poster(uri), callback);
    };

    /**
     * Enter the given text into the given campfire room
     *
     * @param {integer} roomId
     * @param {string} message
     * @param {function} callback (error, request, response, body)
     */
    that.room.postTextMessage = function(roomId, message, callback) {
        instantMessage(roomId, message, "TextMessage", callback)
    };

    /**
     * 'Paste' the given text into tat given campfire room
     *
     * @param {integer} roomId
     * @param {string} pasteData
     * @param {function} callback (error, request, response, body)
     */
    that.room.pasteMessage = function(roomId, pasteData, callback) {
        instantMessage(roomId, pasteData, "PasteMessage", callback)
    };

    /**
     * Fetch the given statusURL and insert results into the campfire room
     *
     * @param {integer} roomId
     * @param {string} tweetUrl
     * @param {function} callback (error, request, response, body)
     */
    that.room.tweetMessage = function(roomId, tweetUrl, callback) {
        instantMessage(roomId, tweetUrl, "TweetMessage", callback)
    };

    /**
     * Play the given sound in the campfire room
     *
     * @param {integer} roomId
     * @param {string} soundName
     * @param {function} callback (error, request, response, body)
     */
    that.room.playSound = function(roomId, soundName, callback) {
        instantMessage(roomId, soundName, "SoundMessage", callback)
    };

    /**
     * Transcript - get all messages posted today for the given room
     *
     * @param {integer} roomId
     * @param {function} callback (error, request, response, body)
     */
    that.room.transcript = function(roomId, callback) {
        assertIsInt(roomId);

        var uri = composeUri('room/{0}/transcript', roomId);
        execute(getter(uri), callback);
    };

    /**
     * Transcript - get all messages posted to the given room on the given date
     *
     * @param {integer} roomId
     * @param {Date} date
     * @param {function} callback (error, request, response, body)
     */
    that.room.transcriptOnDate = function(roomId, date, callback) {
        assertIsInt(roomId);
        assertIsDate(date);

        // campfire's API doesn't follow the standard of 0...11 numbering for "months" as defined by the
        // Javascript Date object. Campfire uses 1...12. This explains the "+1" below.

        var uri = composeUri('room/{0}/transcript/{1}/{2}/{3}', roomId, date.getFullYear(), date.getMonth() + 1, date.getDate());
        execute(getter(uri), callback);
    };

    // -- Account APIs --
    /**
     * Get account info the the current user
     *
     * @param {function} callback (error, request, response, body)
     */
    that.account = function(callback) {
        var uri = composeUri('account');
        execute(getter(uri), callback);
    };


    // -- Search APIs --
    /**
     * Search all rooms for instances of the given search phrase
     *
     * @param {string} searchTerm
     * @param {function} callback (error, request, response, body)
     */
    that.search = function(searchTerm, callback) {
        var uri = composeUri('search/{0}', searchTerm);
        execute(getter(uri), callback);
    };


    // -- Messages APIs --

    /**
     * Get recent messages in the specified room, defaults to the last 100 messages.
     *
     * @param {integer} roomId
     * @param {integer} limit
     * @param {integer} sinceMessageId
     * @param {function} callback
     */
    that.messages = function(roomId, limit, sinceMessageId, callback) {
        var uri = composeUriWithQueryParameters('room/{0}/recent',
            {
                 limit: limit
                ,since_message_id: sinceMessageId
            },
            roomId
        );
        execute(getter(uri), callback);
    };


    that.message = {};
    /**
     * Highlight or unhighlight a message
     * @param {integer} messageId
     * @param {bool} highlight
     * @param {function} callback (error, request, response, body)
     */
    that.message.highlight = function(messageId, highlight, callback) {
        assertIsInt(messageId);

        var uri = composeUri('messages/{0}/star', messageId);
        var doer = highlight ? poster(uri) : deleter(uri);
        execute(doer, callback);
    };

    return that;
}