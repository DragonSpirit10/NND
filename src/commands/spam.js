const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder().setName('spam')
  .setDescription('spam the living hell out of the bot')
  .addNumberOption(option =>
    option.setName('amount')
      .setDescription('The amount of spam to send')
      .setRequired(true)
  );

let rand = Math.floor(Math.random() * 100) + 1;
let spam = "spam ".repeat(rand);  

function run({ interaction, client }) {
  const amount = interaction.options.getNumber('filtamountre')

  for (let i = 0; i < amount; i++) {
    interaction.reply(spam);
  }
}

const options = {};

module.exports = { data, run, options };