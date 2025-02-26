require("dotenv").config();

module.exports = (client) => {
  console.log(`Logged in as ${client.user.username}`);
  client.channels.fetch(process.env.CHANNEL_ID)
    .then(channel => {
      channel.send('(' + new Date().toLocaleString() + ') Bot is ready! :D');
    })
    .catch(console.error);
};