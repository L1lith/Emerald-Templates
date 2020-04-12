const findFilesByExtension = require('../functions/findFilesByExtension')
const processEmeraldLinks = require('./processEmeraldLinks')
const populateEmeralds = require('./populateEmeralds')
const processEmeraldScripts = require('./processEmeraldScripts')

async function processOutputFolder(outputFolder, templateFolder) {
  await processEmeraldLinks(outputFolder, templateFolder)
  await populateEmeralds(outputFolder, templateFolder)
  await processEmeraldScripts(outputFolder, templateFolder)
}

module.exports = processOutputFolder
