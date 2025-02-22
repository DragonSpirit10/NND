const { EmbedBuilder } = require('discord.js');
const { findItem } = require('./Filter/itemsFilter');

function createItemEmbed(item, IsReprint = false) {
  const embed = new EmbedBuilder()
    .setTitle(item.name)
    .setColor(0x0099ff)
    .setFooter({ text: `Source: ${formatSource(item.source)}, Page: ${item.page}` });

  if (item.rarity) embed.addFields({ name: 'Rarity', value: item.rarity, inline: true });
  
  if (item.reqAttune) embed.addFields({ name: 'Requires Attunement', value: item.reqAttune ? 'Yes' : 'No', inline: true });

  if (item.bonusWeapon) embed.addFields({ name: 'Attack Bonus', value: item.bonusWeapon, inline: true });
  
  if (item.dmg1) embed.addFields({ name: 'Damage', value: `${item.dmg1} ${item.dmgType}`, inline: true });
  
  if (item.dmg2) embed.addFields({ name: 'Versatile Damage', value: `${item.dmg2} ${item.dmgType}`, inline: true });

  if (item.entries && item.entries.length) {
    const description = item.entries.map(entry => 
      typeof entry === 'string' ? entry : entry.items?.join('\n') || ''
    ).join('\n\n');

    embed.setDescription(description.length > 4093 ? description.slice(0, 4093) + '...' : description);
  }

  if (item.light) {
    const lightInfo = item.light.map(light => `Bright: ${light.bright} ft, Dim: ${light.dim} ft`).join('\n');
    embed.addFields({ name: 'Light Emission', value: lightInfo, inline: true });
  }

  if (item.sentient) {
    embed.addFields({ name: 'Sentience', value: 'Yes', inline: true });
  }

  if (IsReprint) {
    embed.setTitle(`Reprinted in ${formatSource(item.source)} as :\n${item.name}`);
    return embed;
  }

  const arrayEmbed = [embed];

  if (item.reprintedAs) {
    const reprintedAs = createItemEmbed(findItem(item.reprintedAs[0]), true);
    arrayEmbed.push(reprintedAs);
  }

  const trueObjet = new EmbedBuilder().setTitle('True Object')
    .setDescription(objToString(item))
    .setColor(0x0099ff);
  arrayEmbed.push(trueObjet);

  return arrayEmbed;
}

function createItemEmbed(item, IsReprint = false) {
  const embed = new EmbedBuilder()
    .setTitle(item.name)
    .setColor(0x0099ff)
    .setFooter({ text: `Source: ${formatSource(item.source)}, Page: ${item.page}` });

    let description = '';

    if (item.type) {
      const type = item.type.split("|");
      switch (type[0]) {
        case "M": description += "Magic "; break;
        case "R": description += "Ranged Weapon "; break;
        case "A": description += "Ammunition "; break;
        case "S": description += "Shield "; break;
        case "LA": description += "Light Armor "; break;
        case "MA": description += "Medium Armor "; break;
        case "HA": description += "Heavy Armor "; break;
        case "G": description += "Gear "; break;
        case "GV": description += "Generic Variant "; break;
        case "P": description += "Potion "; break;
        case "SC": description += "Scroll "; break;
        case "W": description += "Wondrous Item "; break;
        case "RD": description += "Rod "; break;
        case "ST": description += "Staff "; break;
        case "WD": description += "Wand "; break;
        case "AT": description += "Artisan's Tools "; break;
        case "INS": description += "Instrument "; break;
        case "T": description += "Trade Good "; break;
        case "EXP": description += "Explosive "; break;
        case "GV": description += "Generic Variant "; break;
        case "AF": description += "Ammunition "; break;
        case "EM": description += "Emblem "; break;
        case "INS": description += "Insignia "; break;
        case "M": description += "Mount "; break;
        case "SC": description += "Spellcasting Focus "; break;
        case "TG": description += "Tool "; break;
        case "MNT": description += "Mount "; break;
        case "VEH": description += "Vehicle "; break;
        case "SHP": description += "Vehicle (Sailing Ship) "; break;
        case "SMP": description += "Vehicle (Simple Machine) "; break;
        case "": description += "Unknown "; break;
        default: description += type[0]; break;
      }
    }

    if (item.staff) {
      description += "Staff";
    }

    if (item.wondrous) {
      description += "Wondrous Item ";
    }

    if (item.rarity) {
      description += `${item.rarity} `;
    }

    if (item.reqAttune) {
      description += `(${item.reqAttune ? 'Requires Attunement' : 'No Attunement Required'}) `;
    }
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