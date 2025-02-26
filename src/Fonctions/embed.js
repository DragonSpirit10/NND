const { EmbedBuilder } = require('discord.js');
const { findItem } = require('./Filter/itemsFilter');

function createItemEmbed(item, IsReprint = false) {
  const arrayEmbed = [];

  try {
    const embed = new EmbedBuilder()
      .setTitle(item.name)
      .setColor(getColorForRarity(item.rarity))
      .setFooter({ text: `Source: ${formatSource(item.source)}, Page: ${item.page}` });

    let description = '';
  
    if (item.type) {
      const type = item.type.split("|");
      switch (type[0]) {
        case "M": description += "Melee "; break;
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

    if (item.weaponCategory) {
      description += `${item.weaponCategory} weapon `;
    }

    if (item.staff) {
      description += "Staff";
    }

    if (item.wondrous) {
      description += "Wondrous Item ";
    }

    if (item.rarity) {
      if (item.rarity == "None") {
        description += "rarity Nan ";
      } else {
        description += `${item.rarity} `;
      }
    }

    if (item.reqAttune) {
      description += `(${item.reqAttune ? 'Requires Attunement' : 'No Attunement Required'}) `;
    }

    embed.setDescription(description);
    
    if (item.value) embed.addFields({ name: 'Value', value: formatValue(item.value), inline: true });

    if (item.ac) embed.addFields({ name: 'Armor Class', value: `${item.ac}`, inline: true });
    
    if (item.stealth) embed.addFields({ name: 'Stealth Disadvantage', value: item.stealth ? 'Yes' : 'No', inline: true });

    if (item.weight) embed.addFields({ name: 'Weight', value: `${item.weight} lb`, inline: true});

    if (item.range) embed.addFields({ name: 'Range', value: item.range, inline: true });

    if (item.damage) embed.addFields({ name: 'Damage', value: item.damage, inline: true });

    if (item.properties) embed.addFields({ name: 'Properties', value: item.properties.join(', '), inline: true });

    if (item.reqAttune) embed.addFields({ name: 'Requires Attunement', value: item.reqAttune ? 'Yes' : 'No', inline: true });

    if (item.bonusWeapon) embed.addFields({ name: 'Attack Bonus', value: item.bonusWeapon, inline: true });
    
    if (item.dmg1) embed.addFields({ name: 'Damage', value: `${item.dmg1} ${item.dmgType}`, inline: true });
    
    if (item.dmg2) embed.addFields({ name: 'Versatile Damage', value: `${item.dmg2} ${item.dmgType}`, inline: true });

    if (item.light) {
      const lightInfo = item.light.map(light => `Bright: ${light.bright} ft, Dim: ${light.dim} ft`).join('\n');
      embed.addFields({ name: 'Light Emission', value: lightInfo, inline: true });
    }

    if (item.sentient) {
      embed.addFields({ name: 'Sentience', value: 'Yes', inline: true });
    }

    transformToEmbedFields(item.entries).forEach(field => embed.addFields(field));

    if (IsReprint) {
      embed.setTitle(`Reprinted in ${formatSource(item.source)} as :\n${item.name}`);
      return embed;
    }

    arrayEmbed.push(embed);

    if (item.reprintedAs) {
      const reprintedAs = createItemEmbed(findItem(item.reprintedAs[0]), true);
      arrayEmbed.push(reprintedAs);
    }
  } catch(e) {
    console.error(e);

    const trueObjets = objToString(item)
    
    do {
      const trueObjet = new EmbedBuilder().setTitle('Erreur True Object')
        .setDescription(trueObjets.slice(0, 4090))
        .setColor(0x0099ff);
      arrayEmbed.push(trueObjet);
      trueObjets = trueObjets.slice(4090);
    } while (trueObjets.length > 4090);
  }
  
  return arrayEmbed;
}

function createEmbedsFromItems(items) {
    if (!Array.isArray(items)) items = [items];
    return items.map(createItemEmbed);
}

function formatValue(value) {
  if (value % 100 == 0) {
    return value / 100 + "gp";
  }
  if (value % 10 == 0) {
    return value / 10 + "sp";
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

/**
 * Calculates the total character length of an embed.
 * @param {Object} embed - The embed object.
 * @returns {number} The total character length.
 */
function calculateEmbedLength(embed) {
  let total = 0;
  if (embed.title) total += embed.title.length;
  if (embed.description) total += embed.description.length;
  if (embed.footer && embed.footer.text) total += embed.footer.text.length;
  if (embed.author && embed.author.name) total += embed.author.name.length;
  if (Array.isArray(embed.fields)) {
    embed.fields.forEach(field => {
      if (field.name) total += field.name.length;
      if (field.value) total += field.value.length;
    });
  }
  return total;
}

function transformToEmbedFields(entries) {
  if (!Array.isArray(entries)) {
      throw new Error("Invalid data: Expected an array of entries.");
  }

  return entries.map(entry => {
      if (typeof entry === "string") {
          return { name: "Description", value: entry, inline: false };
      } else if (typeof entry === "object" && entry.type === "entries" && entry.name) {
          let value = "";
          
          entry.entries.forEach(subEntry => {
              if (typeof subEntry === "string") {
                  value += `- ${subEntry}\n`;
              } else if (subEntry.type === "list" && Array.isArray(subEntry.items)) {
                  value += subEntry.items.map(item => `• ${item}`).join("\n") + "\n";
              }
          });

          return { name: entry.name, value: value || "N/A", inline: false };
      }
  }).filter(Boolean);
}

function getColorForRarity(rarity) {
  switch (rarity) {
    case 'Common': return 0xCFCFCF;
    case 'Uncommon': return 0x2ECC71;
    case 'Rare': return 0x3498DB;
    case 'Very Rare': return 0x8E44AD;
    case 'Legendary': return 0xE67E22;
    case 'Artifact': return 0xE9362D;
    case 'Unknown': return 0x9B59B6;
    default: return 0x9B9B9B;
  }
}

module.exports = {
  createItemEmbed,
  calculateEmbedLength,
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

