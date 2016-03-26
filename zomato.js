var https = require("https");

module.exports = {
	get: function(apiKey, id, callback) {
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
					res.push(dish.name + " " + dish.price);
				}
				callback(res);
			});
		});

		req.end();
	}
};