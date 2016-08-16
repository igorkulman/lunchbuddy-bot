var http = require("http");
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var request = require('request-promise');

function today(td) {
    var d = new Date();
    return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
}

var getMenu = async(function (cityId) {
    var data = await(request.get({
        url: "http://ordr-api-production.azurewebsites.net/offers/weeklymenu?cityid=" + cityId
    }));
    var res = [];

    var j = JSON.parse(data);
    var todaysDate = new Date();

    for (var i = 0; i < j.weekly_menu.length; ++i) {

        var d = new Date(j.weekly_menu[i].date);

        var isToday = today(d);

        if (isToday) {
            for (var k = 0; k < j.weekly_menu[i].shifts[0].meals.length; ++k) {
                res.push({
                    "name": j.weekly_menu[i].shifts[0].meals[k].name,
                    "price": j.weekly_menu[i].shifts[0].meals[k].price,
                    "image": j.weekly_menu[i].shifts[0].meals[k].image_url
                });
            }
        }
    }
    return res;
});

module.exports = {
    handles: function (restaurant) {
        return restaurant == "ordr";
    },

    restaurants: function () {
        return ["ordr"]
    },

    get: async(function (restaurant) {
        return await(getMenu(1));
    }),

    name: function (restaurant) {
        return "ORDR (Prague)"
    }
};