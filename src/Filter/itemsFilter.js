const items      = require("../../data/items.json");
const baseItems  = require("../../data/items-base.json");
const fluffitems = require("../../data/fluff-items.json");

function itemsFilter(string, keep) {
  const filteredItems = items.item.filter((item) => {
    return item.name.toLowerCase().includes(string.toLowerCase());
  });

  const filteredName = filteredItems.map((item) => {
    return item.name + " (" + item.source + ")";
  });

  return filteredName.slice(0, keep);
}

exports.itemsFilter = itemsFilter;