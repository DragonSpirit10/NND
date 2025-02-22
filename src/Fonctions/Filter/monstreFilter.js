const bestiaryXmm = require("../../dataGit/bestiary/bestiary-xmm.json");
const bestiaryXmmfluff = require("../../dataGit/bestiary/fluff-bestiary-xmm.json");
const Fuse = require('fuse.js');

const bestiaryLists = bestiaryXmm.monster;

const fuseOptions = {
  keys: [
    "name",
    "source",
    "size",
    "type",
    "ac",
    "alignment"
  ],
  threshold: 0.6,
  includeScore: true,
}

const fuse = new Fuse(bestiaryLists, fuseOptions)

function bestiaryFilterNb(string, keep) {
  return bestiaryFilter(string).slice(0, keep);
}

function bestiaryFilter(string) {
  console.log(string);
  const filteredbestiary = fuse.search(string);
  return filteredbestiary;
}

function findMonster(TargetFilter) {
  const uniqueId = TargetFilter.split("|");

  const bestiaryfound = bestiaryLists.find((item) => {
    return item.name === uniqueId[0] && item.source === uniqueId[1];
  });

  return bestiaryfound;
}

module.exports = {
  bestiaryFilterNb,
  findMonster
};