// Copyright 2012 Peter Potrebic.  All rights reserved.

var assert = require('assert');
var support = require("./lib/support");

suite('User:', function(){
    var campfire;

    setup(function(){
        campfire = support.createCampfireAPI();
    });

    test('Info', function(done){
        campfire.user( support.testInfo.userId,
            function(responseBody, response, error) {
                var expectedUri = support.formatString("/users/{0}.json", support.testInfo.userId);
                assert.equal(support.lastRequest.uri, expectedUri, "URI mismatch: " + support.lastRequest.uri + ", " + expectedUri);
                assert.equal(200, response.statusCode);
//                console.log(responseBody);
                done();
            }
        );
    });

    test('My User Info', function(done){
        campfire.me(
            function(responseBody, response, error) {
                var expectedUri = "/users/me.json"
                assert.equal(support.lastRequest.uri, expectedUri, "URI mismatch: " + support.lastRequest.uri + ", " + expectedUri);
                assert.equal(200, response.statusCode);
//                console.log(responseBody);
                done();
            }
        );
    });


    test('Non existent user', function(done){
        support.api.setNextReturn(404);
        campfire.user( 1,
            function(responseBody, response, error) {
                assert.equal(404, response.statusCode);
                done();
            }
        );
    });
});
