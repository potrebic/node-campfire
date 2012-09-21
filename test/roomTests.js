// Copyright 2012 Peter Potrebic.  All rights reserved.

var assert = require('assert');
var support = require("./lib/support");

suite('Room Tests:', function(){
    var campfire;

    setup(function(){
        campfire = support.createCampfireAPI();
    });

    suite('Room Info:', function(){
        test('Get info on all rooms', function(done){
            campfire.rooms(
                function(responseBody, response, error) {
                    assert.equal(200, response.statusCode);
                    assert.equal(support.lastRequest.uri, support.formatString("/rooms.json"), "URI mismatch");
                    done();
                }
            );
        });

        test('Get info on a room, int', function(done) {
            campfire.room(support.testInfo.roomIdInt,
                function(responseBody, response, error) {
                    var expectedUri = support.formatString("/room/{0}.json", support.testInfo.roomIdInt);
                    assert.equal(support.lastRequest.uri, expectedUri, "URI mismatch: " + support.lastRequest.uri + ", " + expectedUri);
                    assert.equal(200, response.statusCode);
                    done();
                }
            );
        });

        test('Get info on a room, string', function(done) {
            campfire.room(support.testInfo.roomIdStr,
                function(responseBody, response, error) {
                    assert.equal(200, response.statusCode);
                    assert.equal(support.lastRequest.uri, support.formatString("/room/{0}.json", support.testInfo.roomIdStr), "URI mismatch");
                    done();
                }
            );
        });

        test('Non existent room', function(done){
            support.api.setNextReturn(302);         // yep, that's what campfire returns if you pass in a non-existent roomId
            campfire.room( 101,
                function(responseBody, response, error) {
                    assert.equal(302, response.statusCode);
                    done();
                }
            );
        });

        test('Get info on a room, bad typeof roomId', function(done) {
            support.api.expectsException( function() {
                campfire.room("fred",
                    function(responseBody, response, error) {
                        assert(false, 'should not be here');
                    }
                );
            }, 'TypeError');
            done();
        });
    });


    suite('Room Update:', function(){
        test('Update a room', function(done){
            support.api.setNextReturn(200);
            campfire.room.update(support.testInfo.roomIdInt, '', '',
                function(responseBody, response, error) {
                    assert.equal(support.lastRequest.uri, support.formatString("/room/{0}.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(200, response.statusCode);
                    done();
                }
            );
        });

        test('Update a room, bad typeof roomId', function(done){
            support.api.expectsException( function() {
                campfire.room.update(23.4, '', '',
                    function(responseBody, response, error) {
                        assert(false, "should not be here");
                    }
                );
            }, "TypeError");
            done();
        });

        test('Update a room, bad typeof topic', function(done){
            support.api.expectsException( function() {
                campfire.room.update(support.testInfo.roomIdInt, 23.0, '',
                    function(responseBody, response, error) {
                        assert(false, "should not be here");
                    }
                );
            }, "TypeError");
            done();
        });


        test('Update a room, bad typeof name', function(done){
            support.api.expectsException( function() {
                campfire.room.update(support.testInfo.roomIdInt, null, {},
                    function(responseBody, response, error) {
                        assert(false, "should not be here");
                    }
                );
            }, "TypeError");
            done();
        });

        test('Update a room, proper request body, only changing topic', function(done){
            support.api.setNextReturn(200);
            campfire.room.update(support.testInfo.roomIdInt, "Some message", null,
                function(responseBody, response, error) {
                    assert.equal(support.lastRequest.uri, support.formatString("/room/{0}.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(200, response.statusCode);
                    var expected = {room: { topic: "Some message"}};
                    assert._isEqual(expected, support.lastRequest.body, "Didn't get expected body");
                    done();
                }
            );
        });

        test('Update a room, proper request body, changing both', function(done){
            support.api.setNextReturn(200);
            campfire.room.update(support.testInfo.roomIdInt, "Some message", "newRoomName",
                function(responseBody, response, error) {
                    assert.equal(support.lastRequest.uri, support.formatString("/room/{0}.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(200, response.statusCode);
                    var expected = {room: { topic: "Some message",  name: "newRoomName"}};
                    assert._isEqual(expected, support.lastRequest.body, "Didn't get expected body");
                    done();
                }
            );
        });

        test('Update a room, proper request body, only changing name', function(done){
            support.api.setNextReturn(200);
            campfire.room.update(support.testInfo.roomIdInt, null, "newRoomName",
                function(responseBody, response, error) {
                    assert.equal(support.lastRequest.uri, support.formatString("/room/{0}.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(200, response.statusCode);
                    var expected = {room: { name: "newRoomName"}};
                    assert._isEqual(expected, support.lastRequest.body, "Didn't get expected body");
                    done();
                }
            );
        });

        test('Update a room, proper request body, clearing topic', function(done){
            support.api.setNextReturn(200);
            campfire.room.update(support.testInfo.roomIdInt, "", null,
                function(responseBody, response, error) {
                    assert.equal(200, response.statusCode);
                    assert.equal(support.lastRequest.uri, support.formatString("/room/{0}.json", support.testInfo.roomIdInt), "URI mismatch");
                    var expected = {room: { topic: null}};
                    assert._isEqual(expected, support.lastRequest.body, "Didn't get expected body");
                    done();
                }
            );
        });

    });

    suite('Room Presence:', function(){
        test('Enter a room', function(done){
            support.api.setNextReturn(200);
            campfire.room.presence(support.testInfo.roomIdInt, true,
                function(responseBody, response, error) {
                    assert.equal(support.lastRequest.uri, support.formatString("/room/{0}/join.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(200, response.statusCode);
                    done();
                }
            );
        });

        test('leave a room, bad typeof roomId', function(done){
            support.api.expectsException( function() {
                campfire.room.presence(23.4, false,
                    function(responseBody, response, error) {
                        assert(false, "should not be here");
                    }
                );
            }, "TypeError");
            done();
        });

        test('Leave a room', function(done){
            support.api.setNextReturn(200);
            campfire.room.presence(support.testInfo.roomIdInt, false,
                function(responseBody, response, error) {
                    assert.equal(support.lastRequest.uri, support.formatString("/room/{0}/leave.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(200, response.statusCode);
                    done();
                }
            );
        });

    });


    suite('Room Locking:', function(){
        test('Lock a room', function(done){
            support.api.setNextReturn(200);
            campfire.room.lock(support.testInfo.roomIdInt, true,
                function(responseBody, response, error) {
                    assert.equal(support.lastRequest.uri, support.formatString("/room/{0}/lock.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(200, response.statusCode);
                    done();
                }
            );
        });

        test('Enter a room, bad typeof roomId', function(done){
            support.api.expectsException( function() {
                campfire.room.lock("ab34", false,
                    function(responseBody, response, error) {
                        assert(false, "should not be here");
                    }
                );
            }, "TypeError");
            done();
        });

        test('Unlock a room', function(done){
            support.api.setNextReturn(200);
            campfire.room.lock(support.testInfo.roomIdInt, false,
                function(responseBody, response, error) {
                    var expected = support.formatString("/room/{0}/unlock.json", support.testInfo.roomIdInt);
                    assert.equal(support.lastRequest.uri, expected, "URI mismatch: " + support.lastRequest.uri + ", " + expected);
                    assert.equal(200, response.statusCode);
                    done();
                }
            );
        });

    });

    suite('Posting Messages:', function(){
        test('Basic text post', function(done){
            campfire.room.postTextMessage(support.testInfo.roomIdInt, "Hi there folks!",
                function(responseBody, response, error) {
                    assert.equal(support.lastRequest.uri, support.formatString("/room/{0}/speak.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(201, response.statusCode);
                    var expected = {message: {
                        body: "Hi there folks!"
                        ,type: "TextMessage"
                    }};
                    assert._isEqual(expected, support.lastRequest.body, "Didn't get expected body");
                    done();
                }
            );
        });

        test('Basic paste message', function(done){
            campfire.room.pasteMessage(support.testInfo.roomIdInt, "Hi there folks!",
                function(responseBody, response, error) {
                    assert.equal(support.lastRequest.uri, support.formatString("/room/{0}/speak.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(201, response.statusCode);
                    var expected = {message: {
                        body: "Hi there folks!"
                        ,type: "PasteMessage"
                    }};
                    assert._isEqual(expected, support.lastRequest.body, "Didn't get expected body");
                    done();
                }
            );
        });

        test('Basic twitterURL post', function(done){
            campfire.room.tweetMessage(support.testInfo.roomIdInt, "https://twitter.com/Kred/status/239142587255115776",
                function(responseBody, response, error) {
                    assert.equal(support.lastRequest.uri, support.formatString("/room/{0}/speak.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(201, response.statusCode);
                    var expected = {message: {
                        body: "https://twitter.com/Kred/status/239142587255115776"
                        ,type: "TweetMessage"
                    }};
                    assert._isEqual(expected, support.lastRequest.body, "Didn't get expected body");
                    done();
                }
            );
        });

        test('Basic play sound', function(done){
            campfire.room.playSound(support.testInfo.roomIdInt, "inconceivable",
                function(responseBody, response, error) {
                    assert.equal(support.lastRequest.uri, support.formatString("/room/{0}/speak.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(201, response.statusCode);
                    var expected = {message: {
                        body: "inconceivable"
                        ,type: "SoundMessage"
                    }};
                    assert._isEqual(expected, support.lastRequest.body, "Didn't get expected body");
                    done();
                }
            );
        });

    });


    suite('Transcripts:', function(){

        test('Today', function(done){
            campfire.room.transcript(support.testInfo.roomIdInt,
                function(responseBody, response, error) {
                    var expected = support.formatString("/room/{0}/transcript.json", support.testInfo.roomIdInt);
                    assert.equal(support.lastRequest.uri, expected, "URI mismatch: " + support.lastRequest.uri + ", " + expected);
                    assert.equal(200, response.statusCode);
                    done();
                }
            );
        });

        test('Specific date', function(done){
            var targetDate = new Date(2012, 6, 1);  // July 1, 2012
            campfire.room.transcriptOnDate(support.testInfo.roomIdInt, targetDate,
                function(responseBody, response, error) {
                    var expected = support.formatString("/room/{0}/transcript/{1}/{2}/{3}.json",
                        support.testInfo.roomIdInt, 2012, 7, 1);
                    assert.equal(support.lastRequest.uri, expected, "URI mismatch: " + support.lastRequest.uri + ", " + expected);
                    assert.equal(200, response.statusCode);
//                    console.log(support.lastRequest.uri);
//                    console.log(responseBody);
                    done();
                }
            );
        });

        test('Bogus date', function(done){
            support.api.expectsException( function() {
                campfire.room.transcriptOnDate(support.testInfo.roomIdInt, "2012",
                    function(responseBody, response, error) {
                        assert(false, "should not be here");
                    }
                );
            }, "TypeError");
            done();
        });

    });

});