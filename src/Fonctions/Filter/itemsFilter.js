const items = require("../../dataGit/items.json");
const baseItems = require("../../dataGit/items-base.json");
//const fluffitems = require("../dataGit/fluff-items.json");
const Fuse = require('fuse.js');

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
  threshold: 0.6,
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

function findBaseItem(nameSource) {
  const [name, source] = nameSource.split("|");
  return baseItems.baseitem.find((item) => item.name === name && item.source === source);
}

module.exports = {
  itemsFilterNb,
  findItem
};