const { Collection } = require('discord.js');
const AnimeClient = require('./classes/AnimeClient.js');

const client = new AnimeClient();
client.commands = new Collection();

require('./handlers/events.js').init(client);
require('./handlers/commands.js').init(client);

client.login(require('./config.json').token);
