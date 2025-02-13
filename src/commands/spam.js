const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('spam')
  .setDescription('spam the living hell out of the bot')
  .addNumberOption((option) =>
    option.setName('amount')
      .setDescription('The amount of spam to send')
      .setChoices([
        { name: 'One', value: 1 },
        { name: 'A bit', value: 5 },
        { name: 'More', value: 10 },
        { name: 'MORE', value: 20 },
        { name: 'MOOOOOOOORE', value: 50 },
        { name: 'AAAAAAAAAAAAAAAAAHHGHGHGHHG', value: 100 },
      ])
      .setRequired(true))
  .addUserOption((option) =>
    option.setName('victim')
      .setDescription('The victim of the spam torture')
      .setRequired(false)
  );

async function run({ interaction, client }) {
  const amount = interaction.options.getNumber('amount')
  const victim = interaction.options.getUser('victim');

  let message = "";

  if (victim) {
    message = `<@${victim.id}> `;
  } else {
    message = "spam ";
  }

  await interaction.reply("Why");

  for (let i = 0; i < amount; i++) {
    let rand = Math.floor(Math.random() * 100) + 1;
    let spam = message.repeat(rand);  
    await interaction.followUp(spam.length > 2000 ? spam.slice(0, 2000) : spam);
  }
}

const options = {};

module.exports = { data, run, options };