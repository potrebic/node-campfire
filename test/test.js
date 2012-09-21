var assert = require('assert');
var support = require("./lib/support");

var campfire = support.createCampfireAPI();


//campfire.messages(support.testInfo.roomIdInt, null, null,
//    function(responseBody, response, error) {
//        assert.equal(support.last.uri, support.formatString("/room/{0}/recent.json", support.testInfo.roomIdInt), "URI mismatch");
//        assert.equal(200, response.statusCode);
//        console.log(responseBody);
//    }
//);

campfire.message.highlight(support.testInfo.messageId, false,
    function(responseBody, response, error) {
        console.log(response);
        console.log(error);
        if (responseBody)
            console.log(responseBody);
    }
);