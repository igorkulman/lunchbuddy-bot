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

function today(td) {
    var d = new Date();
    return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
}

function getMenu(cityId, callback) {
		download("http://ordr-api-production.azurewebsites.net/offers/weeklymenu?cityid=" + cityId, function(data) {
            if (data) {
                var res = [];

                var j = JSON.parse(data);
                var todaysDate = new Date();

                for (var i = 0; i < j.weekly_menu.length; ++i) {

                    var d = new Date(j.weekly_menu[i].date);

                    var isToday = today(d);

                    if (isToday) {
                        for (var k=0; k< j.weekly_menu[i].shifts[0].meals.length; ++k) {
                            res.push({
                                "name" : j.weekly_menu[i].shifts[0].meals[k].name,
                                "price" : j.weekly_menu[i].shifts[0].meals[k].price,
                                "image" : j.weekly_menu[i].shifts[0].meals[k].image_url
                            });
                        }
                    }
                }

                callback(res);
            } else {
                callback([]);
            }
        });
	}

module.exports = {
	handles: function(restaurant){
		return restaurant=="ordr";
	},

	restaurants: function(){
		return ["ordr"]
	},

	get: function(restaurant, callback) {
		getMenu(1, callback)
	},

	name: function(restaurant) {
		return "ORDR (Prague)"
	}
};