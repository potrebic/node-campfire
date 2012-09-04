// Copyright 2012 Peter Potrebic.  All rights reserved.

var assert = require('assert');
var campfireAPI = require('../../lib/campfire');
var _und = require("underscore");

var config = {
//    campfireName: 'fake',
//    apiToken: 'atoken123'
    campfireName: 'nodoto',
    apiToken: 'a9619c12e3e2c5e83d2deeea8f1bf3296ca578dc',
};
exports.config = config;

var testInfo = {
     roomIdInt: 340141
    ,roomIdStr: '340141'
    ,callRealAPI: true
};
exports.testInfo = testInfo;


var createCampfireAPI = function() {

    if (!testInfo.callRealAPI) {
        console.log('just calling mock APIs');
        config.api = createMock();  // dependency injecting a mock JsonClient to createCampfireAPI() call below
    }

    var campfire = campfireAPI.createCampfireAPI(config);

    if (testInfo.callRealAPI) {
        console.log('calling real campfire APIs');
        testInfo.realAPI = campfire.api;
        campfire.api = createMock();
    }

    return campfire;
};
exports.createCampfireAPI = createCampfireAPI;

/**
 *
 * @type {Object} A public reference the an object that holds 'state' of
 * info past to the callback methods. Allows for unit tests to confirm state.
 */
var last = {
    uri: null,
    body: null
};
exports.last = last;

/**
 * The mock object that simulates the 'restify-JsonClient' interface to campfire's RESTful-ish API
 *
 * @return {Object} the mock 'restify' JsonClient
 */
var createMock = function () {
    var that = {};

    // privates
    var makeMockResponse = function makeMockStatus(statusCode) {
        return {
            "statusCode": statusCode
        };
    }


    // PUBLIC - mocking the restify API

    // api.get(uri, handler);
    that.get = function (uri, handler) {
        last.uri = uri;
        last.body = undefined;

        if (testInfo.realAPI) {
            testInfo.realAPI.get(uri, handler);
        } else {
            // handler's signature: function(error, request, response, responseBody)
            handler(null, {}, makeMockResponse(200), null);
        }
    }

    // api.put(uri, object, handler);
    that.put = function (uri, object, handler) {
        last.uri = uri;
        last.body = object;

        if (testInfo.realAPI) {
            testInfo.realAPI.put(uri, object, handler);
        } else {
            // handler's signature: function(error, request, response, responseBody)
            handler(null, {}, makeMockResponse(200), null);
        }
    }

    // api.post(uri, object, handler);
    that.post = function (uri, object, handler) {
        last.uri = uri;
        last.body = object;

        if (testInfo.realAPI) {
            testInfo.realAPI.post(uri, object, handler);
        } else {
            // handler's signature: function(error, request, response, responseBody)
            handler(null, {}, makeMockResponse(201), null);
        }
    }

    // api.del(uri, handler);
    that.del = function (uri, handler) {
        last.uri = uri;
        last.body = undefined;
        if (testInfo.realAPI) {
            testInfo.realAPI.del(uri, handler);
        } else {
            // handler's signature: function(error, request, response, responseBody)
            handler(null, {}, makeMockResponse(200), null);
        }
    }

    return that;
};

/**
 * Helper function that asserts that 2 JSON objects are equal
 *
 * @param a
 * @param b
 * @param msg
 *
 */
assert._isEqual =  function assert_isEqual(a, b, msg) {
    assert(_und.isEqual(a, b), msg || "objects are not equal");
};

/**
 * Build a little API that has helper functions for the various unit tests
 *
 * @return {Object}
 */
var helpers = function () {
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

exports.formatString = function format(formatStr) {
    var formatted = formatStr;
    for (var i = 0, argIndx = 1; argIndx < arguments.length; i++, argIndx++) {
        var arg = arguments[argIndx].toString();
        arg = encodeURIComponent(arg);
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arg);
    }
    return formatted;
};

exports.api = helpers();