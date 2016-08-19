var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));
var restaurants = JSON.parse(fs.readFileSync('zomato.json'));
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var request = require('request-promise');

var get = async(function (apiKey, id) {
	var data = await(request.get({
        url: "https://developers.zomato.com/api/v2.1/dailymenu?res_id=" + id,
		headers: {
			"user_key": apiKey
		}
    }));

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
	return res;

});

module.exports = {
	handles: function (restaurant) {
		var rest = restaurants.restaurants;
		for (var r in rest) {
			if (rest[r].keyword === restaurant) {
				return true;
			}
		};
		return false;
	},

	restaurants: function () {
		var rest = restaurants.restaurants;
		var resp = []
		for (var restaurant in rest) {
			resp.push(rest[restaurant].keyword)
		}
		return resp;
	},

	get: async(function (restaurant) {
		var rest = restaurants.restaurants;
		for (var r in rest) {
			if (rest[r].keyword == restaurant) {
				return await(get(config.zomato_key, rest[r].id));
			}
		};
	}),

	name: function (restaurant) {
		var rest = restaurants.restaurants;
		for (var r in rest) {
			if (rest[r].keyword == restaurant) {
				return rest[r].name;
			}
		};
		return "";
	}
};