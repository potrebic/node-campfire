// Copyright 2012 Peter Potrebic.  All rights reserved.

var assert = require('assert');
var support = require("./lib/support");

suite('Campfire API', function(){
    var campfire;

    setup(function(){
        campfire = support.createCampfireAPI();
    });


    suite('Search', function(){
        test('Basic search, proper URI', function(done){
            campfire.search("Baseball",
                function(result) {
                    assert.equal(support.last.uri, "/search/Baseball.json");
                    done();
                }
            );
        });
    });


    suite('Search', function(){
        test('Search has special chars, proper URI', function(done){
            campfire.search("Hello There's > %Bob",
                function(result) {
                    assert.equal(support.last.uri, "/search/Hello%20There's%20%3E%20%25Bob.json");
                    done();
                }
            );
        });
    });
});