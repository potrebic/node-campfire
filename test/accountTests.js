// Copyright 2012 Peter Potrebic.  All rights reserved.

var assert = require('assert');
var support = require("./lib/support");

suite('Campfire API', function(){
    var campfire;

    setup(function(){
        campfire = support.createCampfireAPI();
    });


    suite('Account Info', function(){
        test('Get Account info, proper URI', function(done){
            campfire.account(
                function(result) {
                    assert.equal(support.last.uri, "/account.json");
                    done();
                }
            );
        });
    });

});