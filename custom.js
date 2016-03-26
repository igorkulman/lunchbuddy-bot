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

module.exports = {
    avion: function(callback) {
        download("http://avion58.cz/", function(data) {
            if (data) {
                var res = [];

                var parsedHTML = $.load(data);
                parsedHTML('strong.price').map(function(i, food) {
                    var name = $(this).prev().text();

                    if (name) {
                        res.push(name + " " + $(this).text());
                    }
                });

                callback(res);

            } else {
                callback([]);
            }
        });
    },

    motoburger: function(callback) {
        download("http://www.motoburger.cz/", function(data) {
            if (data) {
                var res = [];

                var parsedHTML = $.load(data);
                parsedHTML('tr').map(function(i, food) {
                    var name = $(this).next().text();
                    if (name && !name.startsWith("*ROZVOZ")) {
                        res.push(name);
                    }
                });

                callback(res);
            } else {
                callback([]);
            }
        });
    },

    puzzle: function(callback) {
        download("http://www.puzzlesalads.cz/denni-nabidka", function(data) {
            if (data) {
                var res = [];

                var parsedHTML = $.load(data);
                parsedHTML('span.price').map(function(i, food) {
                    var name = $(this).prev().text();

                    if (name) {
                        res.push(name + " " + $(this).text());
                    }
                });

                callback(res);
            } else {
                callback([]);
            }
        });
    },

    eurest: function(callback) {
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
                        res.push(j.Items[i].MealName);
                    }
                }

                callback(res);
            } else {
                callback([]);
            }
        });
    }
};