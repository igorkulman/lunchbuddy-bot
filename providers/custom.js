var $ = require('cheerio')
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var request = require('request-promise');

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

function today(td) {
    var d = new Date();
    return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
}

var avion = async(function(){
    var data = await (request.get({
        url: "http://avion58.cz/"
    }));

    var res = [];

    var parsedHTML = $.load(data);
    parsedHTML('strong.price').map(function(i, food) {
        var name = $(this).prev().text();

        if (name) {                    
            res.push({
                "name": name,
                "price": $(this).text()
            });
        }
    });

    return res;
});

var motoburger = async(function(){
    var data = await (request.get({
        url: "http://www.motoburger.cz/"
    }));

    var res = [];

    var parsedHTML = $.load(data);
    parsedHTML('tr').map(function(i, food) {
        var name = $(this).next().text();
        if (name && !name.startsWith("*ROZVOZ")) {
            res.push({
                "name": name
            });
        }
    });

    return res;
})

var puzzle = async(function(){
    var data = await (request.get({
        url: "http://www.puzzlesalads.cz/denni-nabidka"
    }));

    var res = [];

    var parsedHTML = $.load(data);
    parsedHTML('span.price').map(function(i, food) {
        var name = $(this).prev().text();

        if (!isEmptyOrSpaces(name)) {                               
            res.push({
                "name": name,
                "price": $(this).text().replace(/(\r\n|\n|\r)/gm," ").replace(/\s\s+/g, ' ')
            });
        }
    });

    return res;
});

var eurest = async(function(){
    var weekNumber = (new Date()).getWeek();

    var data = await (request.get({
        url: "http://www.unasrestaurace.cz/menulist.php?locale=cs&week=" + weekNumber
    }));

    var res = [];

    var j = JSON.parse(data);
    var todaysDate = new Date();

    for (var i = 0; i < j.Items.length; ++i) {

        var re = /-?\d+/;
        var m = re.exec(j.Items[i].Date);
        var d = new Date(parseInt(m[0]));

        var isToday = today(d);

        if (isToday) {                    
            res.push({
                "name": j.Items[i].MealName
            });
        }
    }

    return res;
});

module.exports = {
    handles: function(restaurant) {
        return restaurant == "avion" || restaurant == "motoburger" || restaurant == "puzzle" || restaurant == "eurest";
    },

    restaurants: function() {
        return ["avion", "motoburger", "puzzle", "eurest"]
    },

    get: async (function(restaurant) {
        switch (restaurant) {
            case "avion":                
                return await (avion());
            case "eurest":
                return await(eurest());
            case "puzzle":
                return await (puzzle());
            case "motoburger":
                return await (motoburger());
        }}),

    name: function(restaurant) {
        switch (restaurant) {
            case "avion":
                return "AVION 58";
            case "eurest":
                return "EUREST";
            case "puzzle":
                return "PUZZLE SALADS";
            case "motoburger":
                return "MOTOBURGER";
        }
    }
};