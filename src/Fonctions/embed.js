const { EmbedBuilder } = require('discord.js');
const { findItem } = require('./Filter/itemsFilter');

function createEmbedObject(item, isReprint = false) {
  let embedData;
  try {
    embedData = {
      title: isReprint ? `Reprinted in ${formatSource(item.source)} as: ${item.name}` : item.name,
      color: getColorForRarity(item.rarity),
      footer: `Source: ${formatSource(item.source)}, Page: ${item.page}`,
      description: generateDescription(item),
      fields: generateFields(item)
    };  
  } catch (error) {
    console.log(objToString(item));
    console.log(error);

    embedData = {
      title: "Error",
      color: 0xE9362D,
      footer: `Source: ${formatSource(item.source)}, Page: ${item.page}`,
      description: "An error occured while generating the embed for this item.",
      fields: []
    }
  }

  return embedData;
}

function generateDescription(item) {
    let description = '';
    const typeMap = {
        "M": "Melee ", "R": "Ranged Weapon ", "A": "Ammunition ", "S": "Shield ",
        "LA": "Light Armor ", "MA": "Medium Armor ", "HA": "Heavy Armor ", "G": "Gear ",
        "GV": "Generic Variant ", "P": "Potion ", "SC": "Scroll ", "W": "Wondrous Item ",
        "RD": "Rod ", "ST": "Staff ", "WD": "Wand ", "AT": "Artisan's Tools ",
        "INS": "Instrument ", "T": "Trade Good ", "EXP": "Explosive ", "AF": "Ammunition ",
        "EM": "Emblem ", "MNT": "Mount ", "VEH": "Vehicle ", "SHP": "Vehicle (Sailing Ship) ",
        "SMP": "Vehicle (Simple Machine) ", "TG": "Tool "
    };
    if (item.type) description += typeMap[item.type.split("|")[0]] || "Unknown ";
    if (item.weaponCategory) description += `${item.weaponCategory} weapon `;
    if (item.staff) description += "Staff ";
    if (item.wondrous) description += "Wondrous Item ";
    if (item.rarity) description += (item.rarity === "None" ? "rarity Nan " : `${item.rarity} `);
    if (item.reqAttune) description += `(${item.reqAttune ? 'Requires Attunement' : 'No Attunement Required'}) `;
    return description;
}

function generateFields(item) {
    const fieldMappings = {
      value: (item) => ({ name: 'Value', value: formatValue(item.value), inline: true }),
      ac: (item) => ({ name: 'Armor Class', value: `${item.ac}`, inline: true }),
      stealth: (item) => ({ name: 'Stealth Disadvantage', value: item.stealth ? 'Yes' : 'No', inline: true }),
      weight: (item) => ({ name: 'Weight', value: `${item.weight} lb`, inline: true }),
      range: (item) => ({ name: 'Range', value: item.range, inline: true }),
      damage: (item) => ({ name: 'Damage', value: item.damage, inline: true }),
      properties: (item) => ({ name: 'Properties', value: item.properties.join(', '), inline: true }),
      reqAttune: (item) => ({ name: 'Requires Attunement', value: item.reqAttune ? 'Yes' : 'No', inline: true }),
      bonusWeapon: (item) => ({ name: 'Attack Bonus', value: `${item.bonusWeapon}`, inline: true }),
      dmg1: (item) => ({ name: 'Damage', value: `${item.dmg1} ${item.dmgType}`, inline: true }),
      dmg2: (item) => ({ name: 'Versatile Damage', value: `${item.dmg2} ${item.dmgType}`, inline: true }),
      light: (item) => ({
          name: 'Light Emission',
          value: item.light.map(light => `Bright: ${light.bright} ft, Dim: ${light.dim} ft`).join('\n'),
          inline: true
      }),
      sentient: (item) => ({ name: 'Sentience', value: 'Yes', inline: true }),
    };

    let fields = Object.keys(fieldMappings).flatMap(key => (item[key] !== undefined ? [fieldMappings[key](item)] : []));
  
    if (item.entries) {
      fields = fields.concat(transformEntriesToEmbedFields(item.entries));
    }
  
    return fields;
}

function createEmbedFromObject(embedData) {
    const embed = new EmbedBuilder()
        .setTitle(embedData.title)
        .setColor(embedData.color)
        .setFooter({ text: embedData.footer })
        .setDescription(embedData.description);
    embedData.fields.forEach(field => embed.addFields(field));
    return embed;
}

function createItemEmbed(item, isReprint = false) {
    const embedData = createEmbedObject(item, isReprint);
    const embed = createEmbedFromObject(embedData);
    const arrayEmbed = [embed];
    
    if (item.reprintedAs) {
        const reprintedAs = createItemEmbed(findItem(item.reprintedAs[0]), true);
        arrayEmbed.push(reprintedAs[0]);
    }
    
    return arrayEmbed;
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

function transformEntriesToEmbedFields(entries) {
  if (!Array.isArray(entries)) {
      throw new Error("Invalid data: Expected an array of entries.");
  }

  return entries.map(entry => {
      if (typeof entry === "string") {
          return { name: "", value: entry, inline: false };
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

function addItemFields(embed, item) {
  const fieldMappings = {
      value: (item) => ({ name: 'Value', value: formatValue(item.value), inline: true }),
      ac: (item) => ({ name: 'Armor Class', value: `${item.ac}`, inline: true }),
      stealth: (item) => ({ name: 'Stealth Disadvantage', value: item.stealth ? 'Yes' : 'No', inline: true }),
      weight: (item) => ({ name: 'Weight', value: `${item.weight} lb`, inline: true }),
      range: (item) => ({ name: 'Range', value: item.range, inline: true }),
      damage: (item) => ({ name: 'Damage', value: item.damage, inline: true }),
      properties: (item) => ({ name: 'Properties', value: item.properties.join(', '), inline: true }),
      reqAttune: (item) => ({ name: 'Requires Attunement', value: item.reqAttune ? 'Yes' : 'No', inline: true }),
      bonusWeapon: (item) => ({ name: 'Attack Bonus', value: `${item.bonusWeapon}`, inline: true }),
      dmg1: (item) => ({ name: 'Damage', value: `${item.dmg1} ${item.dmgType}`, inline: true }),
      dmg2: (item) => ({ name: 'Versatile Damage', value: `${item.dmg2} ${item.dmgType}`, inline: true }),
      light: (item) => ({
          name: 'Light Emission',
          value: item.light.map(light => `Bright: ${light.bright} ft, Dim: ${light.dim} ft`).join('\n'),
          inline: true
      }),
      sentient: (item) => ({ name: 'Sentience', value: 'Yes', inline: true }),
  };

  Object.keys(fieldMappings).forEach(key => {
      if (item[key] !== undefined) {
          embed.addFields(fieldMappings[key](item));
      }
  });

  return embed;
}


function getColorForRarity(rarity) {
  switch (rarity) {
    case 'common': return 0xCFCFCF;
    case 'uncommon': return 0x2ECC71;
    case 'rare': return 0x3498DB;
    case 'very rare': return 0x8E44AD;
    case 'legendary': return 0xE67E22;
    case 'artifact': return 0xE9362D;
    case 'unknown': return 0x9B59B6;
    default: return 0x9B9B9B;
  }
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

