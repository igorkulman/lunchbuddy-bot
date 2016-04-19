var Bot = require('slackbots');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));
var zomato = require('./zomato.js');
var custom = require('./custom.js');
var ordr = require('./ordr.js');

var settings = {
    token: config.token,
    name: config.name,
};
var bot = new Bot(settings);

function formatLine(line) {
    return line.replace(/(\r\n|\n|\r)/gm, "").trim() + "\r\n\r\n";
}

function sendResponse(id, data, title) {

    var res = "\r\n\r\n*" + title + "*\r\n\r\n";

    if (data.length == 0) {
        bot.postMessage(id, res+formatLine("data not available"));
        return;
    }

    for (var i = 0; i < data.length; ++i) {
        res = res + formatLine(data[i]);
    }
    bot.postMessage(id, res);
}

function process(msg, id) {
    console.log('received: ' + msg);

    switch (msg) {
        case "help":
            bot.postMessage(id, 'I know *avion*, *puzzle*, *motoburger*, *eurest*, *ordr* and *gurmet*');
            break;
        case "about":
            bot.postMessage(id, 'Lunchbuddy bot by *Igor Kulman*');
            break;
        case "avion":
            custom.avion(function(data) {
                sendResponse(id, data, "AVION 58");
            });
            break;
        case "puzzle":
            custom.puzzle(function(data) {
                sendResponse(id, data, "PUZZLE SALADS");
            });
            break;
        case "motoburger":
            custom.motoburger(function(data) {
                sendResponse(id, data, "MOTOBURGER");
            });
            break;
        case "gurmet":
            zomato.get(config.zomato_key, 16507044, function(data) {
                sendResponse(id, data, "GURMET");
            });
            break;
        case "eurest":
            custom.eurest(function(data) {
                sendResponse(id, data, "EUREST");
            });
            break;
        case "ordr":
            ordr.get(1, function(data) {
                sendResponse(id, data, "ORDR (Prague)");
            });
            break;
        default:
            bot.postMessage(id, 'Sorry, I do not know ' + msg + '. Use *help* to see what I know.');
            break;
    }
}

bot.on('start', function() {
    console.log("bot started");
});

bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm 
    if (data.type == "message" && data.text.startsWith('<@' + bot.self.id + '>:')) {
        var msg = data.text.replace('<@' + bot.self.id + '>: ', '');
        process(msg, data.channel);
    }

    if (data.type == "message" && data.channel.startsWith('D') && !data.bot_id) {
        process(data.text, data.channel);
    }

});