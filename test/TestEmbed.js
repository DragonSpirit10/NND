const { findItem } = require("../src/Fonctions/Filter/itemsFilter");

item = findItem("Sword of Kas|XDMG");

const { createItemEmbed, createEmbedObject } = require("../src/Fonctions/embedItem");

const embeds = createItemEmbed(item);

console.log(embedObj);
