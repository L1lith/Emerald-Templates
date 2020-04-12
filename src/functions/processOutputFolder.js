const findFilesByExtension = require('../functions/findFilesByExtension')
const processEmeraldLinks = require('./processEmeraldLinks')
const populateEmeralds = require('./populateEmeralds')
const processEmeraldScripts = require('./processEmeraldScripts')

async function processOutputFolder(outputFolder) {
  await processEmeraldLinks(outputFolder)
  await populateEmeralds(outputFolder)
  await processEmeraldScripts(outputFolder)
}

module.exports = processOutputFolder
