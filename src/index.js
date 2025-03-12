require("dotenv").config();
const { Client } = require("discord.js");
const { CommandKit } = require('commandkit');

const client = new Client({
  intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'],
});
/*
client.on('error', (error) => {
  client.channels.fetch(process.env.STATUS_CHANNEL_ID)
    .then(channel => {
      channel.send('(' + new Date().toLocaleString() + ') Bot catch a error: ' + error);
    })
    .catch(console.error);
});
*/
new CommandKit({
  client,
  commandsPath: `${__dirname}/commands`,
  eventsPath: `${__dirname}/events`,
  bulkRegister: true,
});

client.login(process.env.TOKEN,);
