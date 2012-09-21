// Copyright 2012 Peter Potrebic.  All rights reserved.

var assert = require('assert');
var support = require("./lib/support");

suite('Message Tests:', function(){
    var campfire;

    setup(function(){
        campfire = support.createCampfireAPI();
    });

    test('Get Recent messages, default', function(done){
        campfire.messages(support.testInfo.roomIdInt, null, null,
            function(responseBody, response, error) {
                assert.equal(support.lastRequest.uri, support.formatString("/room/{0}/recent.json", support.testInfo.roomIdInt), "URI mismatch");
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    test('Get Recent messages, limit==25', function(done){
        campfire.messages(support.testInfo.roomIdInt, 25, null,
            function(responseBody, response, error) {
                assert.equal(support.lastRequest.uri, support.formatString("/room/{0}/recent.json?limit=25", support.testInfo.roomIdInt), "URI mismatch");
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    test('Get Recent messages, since msgId', function(done){
        campfire.messages(support.testInfo.roomIdInt, null, 101,
            function(responseBody, response, error) {
                assert.equal(support.lastRequest.uri, support.formatString("/room/{0}/recent.json?since_message_id=101", support.testInfo.roomIdInt), "URI mismatch");
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    test('Get Recent messages, since msgId & limit', function(done){
        campfire.messages(support.testInfo.roomIdInt, 3, 101,
            function(responseBody, response, error) {
                assert.equal(support.lastRequest.uri, support.formatString("/room/{0}/recent.json?limit=3&since_message_id=101", support.testInfo.roomIdInt), "URI mismatch");
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });


    test('Highlight a message', function(done){
        campfire.message.highlight(support.testInfo.messageId, true,
            function(responseBody, response, error) {
                var expectedUri = support.formatString("/messages/{0}/star.json", support.testInfo.messageId);
                assert.equal(support.lastRequest.uri, expectedUri, "URI mismatch: " + support.lastRequest.uri + ", " + expectedUri);
                assert.equal(201, response.statusCode);
                done();
            }
        );
    });

    test('Unhighlight a message', function(done){
        support.api.setNextReturn(200);
        campfire.message.highlight(support.testInfo.messageId, false,
            function(responseBody, response, error) {
                var expectedUri = support.formatString("/messages/{0}/star.json", support.testInfo.messageId);
                assert.equal(support.lastRequest.uri, expectedUri, "URI mismatch: " + support.lastRequest.uri + ", " + expectedUri);
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });
});
