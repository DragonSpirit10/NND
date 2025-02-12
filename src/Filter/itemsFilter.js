const items = require("../data/items.json");
const baseItems = require("../data/items-base.json");
const fluffitems = require("../data/fluff-items.json");
const Fuse = require('fuse.js')

itemsLists = items.item.concat(baseItems.baseitem);

const fuseOptions = {
  keys: [
    "name",
    "source",
    "rarity",
    "requires",
    "baseitem",
    "othernames"
  ],
  threshold: 0.3,
  includeScore: true,
}

const fuse = new Fuse(itemsLists, fuseOptions)


function itemsFilterNb(string, keep) {
  return itemsFilter(string).slice(0, keep);
}

function itemsFilter(string) {
  const filteredItems = fuse.search(string);

  return filteredItems;
}

function findItem(TargetFilter) {
  const uniqueId = TargetFilter.split("|");

  const itemsfound = itemsLists.find((item) => {
    return item.name === uniqueId[0] && item.source === uniqueId[1];
  });

  return itemsfound;
}

function objToString (obj) {
  let str = '';
  for (const [p, val] of Object.entries(obj)) {
      str += `${p} :: ${val}\n`;
  }
  return str;
}

module.exports = {
  itemsFilterNb,
  findItem,
  objToString
};