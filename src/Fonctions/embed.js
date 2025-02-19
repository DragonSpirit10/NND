const { EmbedBuilder } = require('discord.js');
const { findItem } = require('./itemsFilter');

function createItemEmbed(item, IsReprint = false) {
  // EmbedBuilder
  const embed = new EmbedBuilder()
      .setTitle(item.name)
      .setColor(0x0099ff)
      .setFooter({ text: `Source: ${formatSource(item.source)}, Page: ${item.page}` });

  if (item.fields) {
    for (const field of item.fields) {
      embed.addFields({ name: field.name, value: field.value, inline: field.inline });
    }
  }

  if (item.rarity) embed.addFields({ name: 'Rarity', value: item.rarity, inline: true });
  
  if (item.reqAttune) embed.addFields({ name: 'Requires Attunement', value: item.reqAttune, inline: true });
  
  if (item.bonusSpellAttack || item.bonusSpellSaveDc) {
      embed.addFields({
          name: 'Bonuses',
          value: `${item.bonusSpellAttack ? `Spell Attack: ${item.bonusSpellAttack}\n` : ''}` +
                  `${item.bonusSpellSaveDc ? `Spell Save DC: ${item.bonusSpellSaveDc}` : ''}`,
          inline: true
      });
  }
  
  if (item.focus) embed.addFields({ name: 'Focus', value: item.focus.join(', '), inline: true });

  if (item.value) embed.addFields({ name: 'Value', value: formatValue(item.value), inline: true });

  if (item.entries && item.entries.length) {
      const description = item.entries.join('\n\n')
      embed.setDescription(description.length > 4093 ? description.slice(0, 4093) + '...' : description); //max 4096 characters
  }
  
  // Case of reprinted item
  if (IsReprint) {
    embed.setTitle(`Reprinted in ${formatSource(item.source)} as :\n${item.name}`);
    return embed;
  }
  const arrayEmbed = [];

  if (item.reprintedAs) {
    const reprintedAs = createItemEmbed(findItem(item.reprintedAs[0]), true);
    console.log("aesfs", reprintedAs);
    console.log("aesfs", reprintedAs.data);
    arrayEmbed.push(reprintedAs);
  }

  // dev only True Objet
  const trueObjet = new EmbedBuilder().setTitle('True Objet')
  .setDescription(objToString(item))
  .setColor(0x0099ff)
  arrayEmbed.push(trueObjet);
  // end dev only

  arrayEmbed.unshift(embed); // put main embed at the start of the array

  return arrayEmbed;
}

function createEmbedsFromItems(items) {
    if (!Array.isArray(items)) items = [items];
    return items.map(createItemEmbed);
}

function formatValue(value) {
  if (value % 10 == 0) {
    return value / 10 + "sp";
  } else if (value % 100 == 0) {
    return value / 100 + "gp";
  } else if (value % 1000 == 0) {
    return value / 1000 + "pp";
  }
  return value + "cp";
}

function formatSource(source) {
  switch(source) {
    case "XPHB":
      source = "PHB'24"
      break;
    case "XDMG":
      source = "DMG'24"
      break;
    case "XMM":
      source = "MM'25"
      break;
    default:
      source = source;
  }
  return source;
}

module.exports = {
  createItemEmbed,
}

function objToString (obj) {
  let str = '';
  for (const [p, val] of Object.entries(obj)) {
    if (typeof val === 'object') {
      str += `${p} :: ${objToString(val)}`;
      continue;
    }
      str += `${p} :: ${val}\n`;
  }
  return str;
};