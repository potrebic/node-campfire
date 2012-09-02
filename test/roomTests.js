// Copyright 2012 Peter Potrebic.  All rights reserved.

var assert = require('assert');
var support = require("./lib/support");

suite('Campfire API:', function(){
    var campfire;

    setup(function(){
        campfire = support.createCampfireAPI();
    });

    suite('Room Info:', function(){
        test('Get info on all rooms, proper URI', function(done){
            campfire.rooms(
                function(result) {
                    assert.equal(support.last.uri, "/rooms.json");
                    done();
                }
            );
        });

        test('Get info on a room, proper URI', function(done) {
            campfire.room(123,
                function(result) {
                    assert.equal(support.last.uri, "/room/123.json");
                    done();
                }
            );
        });

        test('Get info on a room, int, proper URI', function(done) {
            campfire.room(123,
                function(result) {
                    assert.equal(support.last.uri, "/room/123.json");
                    done();
                }
            );
        });

        test('Get info on a room, string, proper URI', function(done) {
            campfire.room("456",
                function(result) {
                    assert.equal(support.last.uri, "/room/456.json");
                    done();
                }
            );
        });

        test('Get info on a room, bad typeof roomId', function(done) {
            support.api.expectsException( function() {
                campfire.room("fred",
                    function(result) {
                        assert(false, 'should not be here');
                    }
                );
            }, 'TypeError');
            done();
        });
    });


    suite('Room Update:', function(){
        test('Update a room, proper URI', function(done){
            campfire.room.update(12345, '', '',
                function(result) {
                    assert.equal(support.last.uri, "/room/12345.json");
                    done();
                }
            );
        });

        test('Update a room, bad roomId', function(done){
            support.api.expectsException( function() {
                campfire.room.update(23.4, '', '',
                    function(result) {
                        assert(false, "should not be here");
                    }
                );
            }, "TypeError");
            done();
        });

        test('Update a room, bad topic type', function(done){
            support.api.expectsException( function() {
                campfire.room.update(234, 23.0, '',
                    function(result) {
                        assert(false, "should not be here");
                    }
                );
            }, "TypeError");
            done();
        });


        test('Update a room, bad name type', function(done){
            support.api.expectsException( function() {
                campfire.room.update(234, null, {},
                    function(result) {
                        assert(false, "should not be here");
                    }
                );
            }, "TypeError");
            done();
        });

        test('Update a room, proper request body, only changing topic', function(done){
            campfire.room.update(12345, "Some message", null,
                function(result) {
                    var expected = {room: { topic: "Some message"}};
                    assert._isEqual(expected, support.last.body, "Didn't get expected body");
                    done();
                }
            );
        });

        test('Update a room, proper request body, changing both', function(done){
            campfire.room.update(12345, "Some message", "newRoomName",
                function(result) {
                    var expected = {room: { topic: "Some message",  name: "newRoomName"}};
                    assert._isEqual(expected, support.last.body, "Didn't get expected body");
                    done();
                }
            );
        });

        test('Update a room, proper request body, only changing name', function(done){
            campfire.room.update(12345, null, "newRoomName",
                function(result) {
                    var expected = {room: { name: "newRoomName"}};
                    assert._isEqual(expected, support.last.body, "Didn't get expected body");
                    done();
                }
            );
        });

        test('Update a room, proper request body, clearing topic', function(done){
            campfire.room.update(12345, "", null,
                function(result) {
                    var expected = {room: { topic: null}};
                    assert._isEqual(expected, support.last.body, "Didn't get expected body");
                    done();
                }
            );
        });

    });

    suite('Room Presence:', function(){
        test('Enter a room, proper URI', function(done){
            campfire.room.presence(12345, true,
                function(result) {
                    assert.equal(support.last.uri, "/room/12345/join.json");
                    done();
                }
            );
        });

        test('Enter a room, bad roomId', function(done){
            support.api.expectsException( function() {
                campfire.room.presence(23.4, false,
                    function(result) {
                        assert(false, "should not be here");
                    }
                );
            }, "TypeError");
            done();
        });

        test('Leave a room, proper URI', function(done){
            campfire.room.presence(12345, false,
                function(result) {
                    assert.equal(support.last.uri, "/room/12345/leave.json");
                    done();
                }
            );
        });

    });


    suite('Room Locking:', function(){
        test('Lock a room, proper URI', function(done){
            campfire.room.lock(12345, true,
                function(result) {
                    assert.equal(support.last.uri, "/room/12345/lock.json");
                    done();
                }
            );
        });

        test('Enter a room, bad roomId', function(done){
            support.api.expectsException( function() {
                campfire.room.lock("ab34", false,
                    function(result) {
                        assert(false, "should not be here");
                    }
                );
            }, "TypeError");
            done();
        });

        test('Unlock a room, proper URI', function(done){
            campfire.room.lock(12345, false,
                function(result) {
                    assert.equal(support.last.uri, "/room/12345/unlock.json");
                    done();
                }
            );
        });

    });

});