// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { minutes, uri, debug, client_id } = require('./config.json');
const dotenv = require('dotenv').config()

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function ping(c) {
	try {
		// Fetch the Space Station /status endpoint
		fetch(uri, {
			method: 'GET'
		})
			.then((response) => response.json())
			.then((json) => {
				if (json['players'] === 0) {
					// Change the bot status
					c.user.setPresence({ activities: [{ name: `${json['players']}/${json['soft_max_players']}` }], status: 'idle' });

					// Dump Status in Console
					console.debug(json);
				}
				else {
					// Change the bot status
					c.user.setPresence({ activities: [{ name: `${json['players']}/${json['soft_max_players']}` }], status: 'online' });

					// Dump Status in Console
					console.debug(json);
				}
			})
	} catch(error) {
		console.error(`Error Occured:\n ${error}`);
	}
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.info(`Ready! Logged in as ${c.user.tag}`);

	// Only for the first time
	c.user.setPresence({ activities: [{ name: 'Starting Up' }], status: 'dnd' });

	// Start Timer
	let interval = minutes * 60 * 1000;
	setInterval(function() {
		console.info('Pinging Server Status');
		fetch(uri).then(response => {
			const contentType = response.headers.get("content-type");
			if (contentType === 'application/json') {
				ping(c);
			} else {
				console.warn('API Endpoint is not active');
			}
		});
	}, interval);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
