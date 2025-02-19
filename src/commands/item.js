const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { itemsFilterNb, findItem } = require("../Fonctions/itemsFilter.js");
const { createItemEmbed } = require("../Fonctions/embed.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('item')
    .setDescription('Give details about an item.')
    .addStringOption((option) =>
      option
        .setName('filtre')
        .setDescription('The information the find item you want to know about.')
        .setRequired(true)
        .setAutocomplete(true)
    ),
  run: ({ interaction, client, handler }) => {
    const TargetFilter = interaction.options.getString('filtre');

    const itemsfound = findItem(TargetFilter);
    
    if (!itemsfound) {
      return interaction.reply("No item found.");
    }

    return interaction.reply({ embeds: createItemEmbed(itemsfound) });
  },
  autocomplete: ({ interaction, client, handler }) => {
    const focusedValue = interaction.options.getFocused(true);

    const filteredChoices = itemsFilterNb(focusedValue.value, 25);

    const results = filteredChoices.map((items) => {
      return {
        name: `${items.item.name} (${items.item.source})`,
        value: items.item.name + "|" + items.item.source,
      };
    });

    interaction.respond(results);
  }
}