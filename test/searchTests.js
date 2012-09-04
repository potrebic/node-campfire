// Copyright 2012 Peter Potrebic.  All rights reserved.

var assert = require('assert');
var support = require("./lib/support");

suite('Campfire API:', function(){
    var campfire;

    setup(function(){
        campfire = support.createCampfireAPI();
    });


        test('Basic search', function(done){
            campfire.search("Baseball",
                function(responseBody, response, error) {
                    assert.equal(support.last.uri, "/search/Baseball.json");
                    assert.equal(200, response.statusCode);
                    done();
                }
            );
        });


        test('Search has special chars', function(done){
            campfire.search("Hello There's > %Bob",
                function(responseBody, response, error) {
                    assert.equal(support.last.uri, "/search/Hello%20There's%20%3E%20%25Bob.json");
                    assert.equal(200, response.statusCode);
                    done();
                }
            );
        });
});