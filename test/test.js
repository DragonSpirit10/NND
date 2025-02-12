const { itemsFilterNb, formatOptionList } = require("../src/Filter/itemsFilter.js");

listitem = itemsFilterNb("Rifle", 50);
listitemFormat = formatOptionList(listitem)
console.log(listitemFormat);