const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { bestiaryFilterNb, findMonster } = require("../Fonctions/Filter/monstreFilter.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('monster')
    .setDescription('Give details about a monster.')
    .addStringOption((option) =>
      option
        .setName('filtre')
        .setDescription('The information about the monster you want to know about.')
        .setRequired(true)
        .setAutocomplete(true)
    ),
  run: ({ interaction, client, handler }) => {
    const TargetFilter = interaction.options.getString('filtre');

    const monstersfound = findMonster(TargetFilter);
    
    if (!monstersfound) {
      return interaction.reply("No monster found.");
    }
    
    const embed = new EmbedBuilder()
    .setTitle(monstersfound.name)
    .setColor("Random")

    return interaction.reply({ embeds: [embed] });
  },
  autocomplete: ({ interaction, client, handler }) => {
    const focusedValue = interaction.options.getFocused(true);

    const filteredChoices = bestiaryFilterNb(focusedValue.value, 25);

    const results = filteredChoices.map((monsters) => {
      return {
        name: `${monsters.item.name} (${monsters.item.source})`,
        value: monsters.item.name + "|" + monsters.item.source,
      };
    });

    interaction.respond(results);
  }
}