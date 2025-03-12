const { SlashCommandBuilder } = require('discord.js');
const { itemsFilterNb, findItem } = require("../Fonctions/Filter/itemsFilter.js");
const { createItemEmbed } = require("../Fonctions/embedItem.js");

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
    run: async ({ interaction }) => {
    const TargetFilter = interaction.options.getString('filtre');

    const itemsfound = findItem(TargetFilter);
    
    if (!itemsfound) {
      return interaction.reply("No item found.");
    }

    console.log(`itemsfound : ${itemsfound.name} (${itemsfound.source}) | requested by ${interaction.user.tag} | At ${new Date().toLocaleString()}`);

    const embeds = createItemEmbed(itemsfound);

    await interaction.reply({ embeds: [embeds[0]] });

    if (embeds.length > 1) {
      for (let i = 1; i < embeds.length; i++) {
        await interaction.followUp({ embeds: [embeds[i]] });
      }
    }
  },
  autocomplete: async ({ interaction }) => {
    try {
      const focusedOption = interaction.options.getFocused(true);

      const filteredChoices = itemsFilterNb(focusedOption.value, 25);

      const results = filteredChoices.map(item => ({
        name: `${item.item.name} (${item.item.source})`,
        value: `${item.item.name}|${item.item.source}`
      }));

      await interaction.respond(results);
      
    } catch (error) {
      console.error('Autocomplete error:', error);
    }
  }
};