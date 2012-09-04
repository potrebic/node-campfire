// Copyright 2012 Peter Potrebic.  All rights reserved.

var assert = require('assert');
var support = require("./lib/support");

suite('Campfire API:', function(){
    var campfire;

    setup(function(){
        campfire = support.createCampfireAPI();
    });

    suite('Room Info:', function(){
        debugger;
        test('Get info on all rooms', function(done){
            campfire.rooms(
                function(responseBody, response, error) {
                    assert.equal(200, response.statusCode);
                    assert.equal(support.last.uri, support.formatString("/rooms.json"), "URI mismatch");
                    done();
                }
            );
        });

        test('Get info on a room, int', function(done) {
            campfire.room(support.testInfo.roomIdInt,
                function(responseBody, response, error) {
                    assert.equal(support.last.uri, support.formatString("/room/{0}.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(200, response.statusCode);
                    done();
                }
            );
        });

        test('Get info on a room, string', function(done) {
            campfire.room(support.testInfo.roomIdStr,
                function(responseBody, response, error) {
                    assert.equal(200, response.statusCode);
                    assert.equal(support.last.uri, support.formatString("/room/{0}.json", support.testInfo.roomIdStr), "URI mismatch");
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
            campfire.room.update(support.testInfo.roomIdInt, '', '',
                function(responseBody, response, error) {
                    assert.equal(support.last.uri, support.formatString("/room/{0}.json", support.testInfo.roomIdInt), "URI mismatch");
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
            campfire.room.update(support.testInfo.roomIdInt, "Some message", null,
                function(responseBody, response, error) {
                    assert.equal(support.last.uri, support.formatString("/room/{0}.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(200, response.statusCode);
                    var expected = {room: { topic: "Some message"}};
                    assert._isEqual(expected, support.last.body, "Didn't get expected body");
                    done();
                }
            );
        });

        test('Update a room, proper request body, changing both', function(done){
            campfire.room.update(support.testInfo.roomIdInt, "Some message", "newRoomName",
                function(responseBody, response, error) {
                    assert.equal(support.last.uri, support.formatString("/room/{0}.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(200, response.statusCode);
                    var expected = {room: { topic: "Some message",  name: "newRoomName"}};
                    assert._isEqual(expected, support.last.body, "Didn't get expected body");
                    done();
                }
            );
        });

        test('Update a room, proper request body, only changing name', function(done){
            campfire.room.update(support.testInfo.roomIdInt, null, "newRoomName",
                function(responseBody, response, error) {
                    assert.equal(support.last.uri, support.formatString("/room/{0}.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(200, response.statusCode);
                    var expected = {room: { name: "newRoomName"}};
                    assert._isEqual(expected, support.last.body, "Didn't get expected body");
                    done();
                }
            );
        });

        test('Update a room, proper request body, clearing topic', function(done){
            campfire.room.update(support.testInfo.roomIdInt, "", null,
                function(responseBody, response, error) {
                    assert.equal(200, response.statusCode);
                    assert.equal(support.last.uri, support.formatString("/room/{0}.json", support.testInfo.roomIdInt), "URI mismatch");
                    var expected = {room: { topic: null}};
                    assert._isEqual(expected, support.last.body, "Didn't get expected body");
                    done();
                }
            );
        });

    });

    suite('Room Presence:', function(){
        test('Enter a room', function(done){
            campfire.room.presence(support.testInfo.roomIdInt, true,
                function(responseBody, response, error) {
                    assert.equal(support.last.uri, support.formatString("/room/{0}/join.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(200, response.statusCode);
                    done();
                }
            );
        });

        test('Enter a room, bad typeof roomId', function(done){
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
            campfire.room.presence(support.testInfo.roomIdInt, false,
                function(responseBody, response, error) {
                    assert.equal(support.last.uri, support.formatString("/room/{0}/leave.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(200, response.statusCode);
                    done();
                }
            );
        });

    });


    suite('Room Locking:', function(){
        test('Lock a room', function(done){
            campfire.room.lock(support.testInfo.roomIdInt, true,
                function(responseBody, response, error) {
                    assert.equal(support.last.uri, support.formatString("/room/{0}/lock.json", support.testInfo.roomIdInt), "URI mismatch");
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
            campfire.room.lock(support.testInfo.roomIdInt, false,
                function(responseBody, response, error) {
                    assert.equal(support.last.uri, support.formatString("/room/{0}/unlock.json", support.testInfo.roomIdInt), "URI mismatch");
                    assert.equal(200, response.statusCode);
                    done();
                }
            );
        });

    });

});