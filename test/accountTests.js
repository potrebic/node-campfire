// Copyright 2012 Peter Potrebic.  All rights reserved.

var assert = require('assert');
var support = require("./lib/support");

suite('Account Info:', function(){
    var campfire;

    setup(function(){
        campfire = support.createCampfireAPI();
    });

    test('Get Account info', function(done){
        campfire.account(
            function(responseBody, response, error) {
                var expectedUri = "/account.json"
                assert.equal(support.lastRequest.uri, expectedUri, "URI mismatch: " + support.lastRequest.uri + ", " + expectedUri);
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

});
