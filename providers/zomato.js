var https = require("https");
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));
var restaurants = JSON.parse(fs.readFileSync('zomato.json'));

function gurmet(apiKey, id, callback) {
	var options = {
		host: 'developers.zomato.com',
		port: 443,
		path: '/api/v2.1/dailymenu?res_id=' + id,
		method: 'GET',
		headers: {
			'user_key': apiKey
		}
	};

	var req = https.request(options, function(res) {
		var data = "";
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on("end", function() {
			var j = JSON.parse(data);
			if (j.daily_menus.length == 0) {
				callback([]);
				return;
			}

			var dishes = j.daily_menus[0].daily_menu.dishes;

			var res = [];

			for (var i = 0; i < dishes.length; ++i) {
				var dish = dishes[i].dish;				
				res.push({
					"name": dish.name,
					"price": dish.price
				});
			}
			callback(res);
		});
	});

	req.end();
}

module.exports = {
	handles: function(restaurant) {
		var rest = restaurants.restaurants;
		for (var r in rest) {
			if (rest[r].keyword === restaurant) {
				return true;
			}
		};
		return false;
	},

	restaurants: function() {
		var rest = restaurants.restaurants;
		var resp = []
		for (var restaurant in rest) {
			resp.push(rest[restaurant].keyword)
		}
		return resp;
	},

	get: function(restaurant, callback) {
		var rest = restaurants.restaurants;
		for (var r in rest) {
			if (rest[r].keyword == restaurant) {
				gurmet(config.zomato_key, rest[r].id, callback)
			}
		};
	},

	name: function(restaurant) {
		var rest = restaurants.restaurants;
		for (var r in rest) {
			if (rest[r].keyword == restaurant) {
				return rest[r].name;
			}
		};
		return "";
	}
};