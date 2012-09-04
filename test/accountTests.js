// Copyright 2012 Peter Potrebic.  All rights reserved.

var assert = require('assert');
var support = require("./lib/support");

suite('Campfire API:', function(){
    var campfire;

    setup(function(){
        campfire = support.createCampfireAPI();
    });


    suite('Account Info:', function(){
        test('Get Account info', function(done){
            campfire.account(
                function(responseBody, response, error) {
                    assert.equal(support.last.uri, "/account.json");
                    assert.equal(200, response.statusCode);
                    console.log(responseBody);
                    done();
                }
            );
        });
    });

});