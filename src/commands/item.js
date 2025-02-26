const { SlashCommandBuilder } = require('discord.js');
const { itemsFilterNb, findItem } = require("../Fonctions/Filter/itemsFilter.js");
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
    run: async ({ interaction, client, handler }) => {
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