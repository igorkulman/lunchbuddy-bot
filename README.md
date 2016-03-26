# Lunchbuddy
Lunchbuddy is [Slack](http://slack.com) bot providing daily menus for configured restaurants.

### Configuration

To make Lunchbuddy work, you need to edit the `config.json` file. It contains 3 configurtaion items.

`token` - Slack token that yoz get when creating the bot in Slack    
`name` - the name of the Slack bot    
`zomato_key` - Zomato API key    

No need to get and configure the [Zomato](http://zomato.com) API key when yo do not want to use this service.

### Installation

Lunchbuddy is a regular Node.js app, so just do `npm install` and `node index.js` and the bot will start and connect to Slack (if configured properly). 

### Usage

You can invode Lunchbuddy by mentioning him in any channel you invite him to or you can write him direct message. He respons to `help` and shows you all the restuarants is is configured to fetch the menu for. 

![Asking Lunchbuddy for help](https://raw.githubusercontent.com/igorkulman/lunchbuddy-bot/master/images/help.png)

If you write to Lunchbuddy a name of a configured restaurant, he will respond with the daily menu for this restaurant.

![Showing daily menu](https://raw.githubusercontent.com/igorkulman/lunchbuddy-bot/master/images/menu.png)

### Adding a new restaurant

The easiest way to add a new restaurant is to add a restaurant available in Zomato. You just need the `id` of the restaurant

````
zomato.get(config.zomato_key, 16507044, function(data) {
    sendResponse(id, data, "GURMET");
});
````
