const { findItem } = require("../src/Fonctions/Filter/itemsFilter");

item = findItem("Sword of Kas|XDMG");

const { createItemEmbed, createEmbedObject } = require("../src/Fonctions/embedItem");

const embedObj = createEmbedObject(item, false);

console.log(embedObj);
