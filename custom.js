var $ = require('cheerio')
var http = require("http")

function download(url, callback) {
    http.get(url, function(res) {
        var data = "";
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on("end", function() {
            callback(data);
        });
    }).on("error", function() {
        callback(null);
    });
}

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

function today(td) {
    var d = new Date();
    return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
}

function avion(callback) {
    download("http://avion58.cz/", function(data) {
        if (data) {
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

            callback(res);

        } else {
            callback([]);
        }
    });
}

function motoburger(callback) {
    download("http://www.motoburger.cz/", function(data) {
        if (data) {
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

            callback(res);
        } else {
            callback([]);
        }
    });
}

function puzzle(callback) {
    download("http://www.puzzlesalads.cz/denni-nabidka", function(data) {
        if (data) {
            var res = [];

            var parsedHTML = $.load(data);
            parsedHTML('span.price').map(function(i, food) {
                var name = $(this).prev().text();

                if (name) {                    
                    res.push({
                        "name": name,
                        "price": $(this).text()
                    });
                }
            });

            callback(res);
        } else {
            callback([]);
        }
    });
}

function eurest(callback) {
    var weekNumber = (new Date()).getWeek();

    download("http://www.unasrestaurace.cz/menulist.php?locale=cs&week=" + weekNumber, function(data) {
        if (data) {
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

            callback(res);
        } else {
            callback([]);
        }
    });
}

module.exports = {
    handles: function(restaurant) {
        return restaurant == "avion" || restaurant == "motoburger" || restaurant == "puzzle" || restaurant == "eurest";
    },

    restaurants: function() {
        return ["avion", "motoburger", "puzzle", "eurest"]
    },

    get: function(restaurant, callback) {
        switch (restaurant) {
            case "avion":
                avion(callback);
                break;
            case "eurest":
                eurest(callback);
                break;
            case "puzzle":
                puzzle(callback);
                break;
            case "motoburger":
                motoburger(callback);
                break;
        }
    },

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