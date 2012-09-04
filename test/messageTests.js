// Copyright 2012 Peter Potrebic.  All rights reserved.

var assert = require('assert');
var support = require("./lib/support");

suite('Campfire API: ', function(){
    var campfire;

    setup(function(){
        campfire = support.createCampfireAPI();
    });


    suite('Message Tests:', function(){

        test('Basic text post', function(done){
            campfire.room.postTextMessage(support.testInfo.roomIdInt, "Hi there folks!",
                function(responseBody, response, error) {
                    assert.equal(support.last.uri, support.formatString("/room/{0}/speak.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(201, response.statusCode);
                    var expected = {message: {
                        body: "Hi there folks!"
                       ,type: "TextMessage"
                    }};
                    assert._isEqual(expected, support.last.body, "Didn't get expected body");
                    done();
                }
            );
        });

        test('Basic paste message', function(done){
            campfire.room.pasteMessage(support.testInfo.roomIdInt, "Hi there folks!",
                function(responseBody, response, error) {
                    assert.equal(support.last.uri, support.formatString("/room/{0}/speak.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(201, response.statusCode);
                    var expected = {message: {
                        body: "Hi there folks!"
                        ,type: "PasteMessage"
                    }};
                    assert._isEqual(expected, support.last.body, "Didn't get expected body");
                    done();
                }
            );
        });

        test('Basic twitterURL post', function(done){
            campfire.room.tweetMessage(support.testInfo.roomIdInt, "https://twitter.com/Kred/status/239142587255115776",
                function(responseBody, response, error) {
                    assert.equal(support.last.uri, support.formatString("/room/{0}/speak.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(201, response.statusCode);
                    var expected = {message: {
                        body: "https://twitter.com/Kred/status/239142587255115776"
                        ,type: "TweetMessage"
                    }};
                    assert._isEqual(expected, support.last.body, "Didn't get expected body");
                    done();
                }
            );
        });

        test('Basic play sound', function(done){
            campfire.room.playSound(support.testInfo.roomIdInt, "inconceivable",
                function(responseBody, response, error) {
                    assert.equal(support.last.uri, support.formatString("/room/{0}/speak.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(201, response.statusCode);
                    var expected = {message: {
                        body: "inconceivable"
                        ,type: "SoundMessage"
                    }};
                    assert._isEqual(expected, support.last.body, "Didn't get expected body");
                    done();
                }
            );
        });


    });

});