// Copyright 2012 Peter Potrebic.  All rights reserved.

var assert = require('assert');
var campfireAPI = require('../../lib/campfire');
var _und = require("underscore");

var config = {
    campfireName: 'fake',
    apiToken: 'atoken123'
};
exports.config = config;

var createCampfireAPI = function() {
    config.api = createMock(config);

    var campfire = campfireAPI.createCampfireAPI(config);
    return campfire;
};
exports.createCampfireAPI = createCampfireAPI;


var last = {
    uri: null,
    body: null
};
exports.last = last;


var createMock = function (options) {
    var that = {};

    // privates

    // PUBLIC - mocking the restify API

    // api.get(uri, handler);
    that.get = function (uri, handler) {
        last.uri = uri;
        last.body = undefined;

        // handler's signature: function(error, request, response, body)
        handler(null, {}, {}, last.body);
    }

    // api.put(uri, object, handler);
    that.put = function (uri, object, handler) {
        last.uri = uri;
        last.body = object;
        handler(null, {}, {}, last.body);
    }

    // api.post(uri, object, handler);
    that.post = function (uri, object, handler) {
        last.uri = uri;
        last.body = object;
        handler(null, {}, {}, last.body);
    }

    // api.del(uri, handler);
    that.del = function (uri, handler) {
        last.uri = uri;
        last.body = undefined;
        handler(null, {}, {}, last.body);
    }

    return that;
};

assert._isEqual =  function assert_isEqual(a, b, msg) {
    assert(_und.isEqual(a, b), msg || "objects are not equal");
};

var createAPI = function () {
    var that = {};

    // privates

    // PUBLIC -
    that.baseUri = function () {
        return "https://" + config.campfireName + ".campfirenow.com/";
    };

    that.expectsException = function (action, expected) {
        var recordedError;
        try {
            action();
        } catch (err) {
            recordedError = err;
        }
        assert(recordedError, 'oops, exception failed to fire');
        if (expected) {
            var str = recordedError.toString();
            var regex = new RegExp("^" + expected);
            var match = regex.exec(str);
            assert(match, 'got an exception, regex looking for proper exception type failed');
            assert.equal(expected, match[0], 'wrong type: ' + expected + ', ' + match[0])
        }
    };

    return that;
};
exports.api = createAPI();