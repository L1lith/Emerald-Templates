const findFilesByExtension = require('../functions/findFilesByExtension')
const processEmeraldLink = require('./processEmeraldLink')
const populateEmerald = require('./populateEmerald')
const processEmeraldScript = require('./processEmeraldScript')


async function processOutputFolder(outputFolder) {
  let emeraldLinks = [null]
  while (emeraldLinks.length > 0) {
    emeraldLinks = await findFilesByExtension(outputFolder, '.emerald-link')
    if (emeraldLinks.length > 0) {
      console.log("Processing the .emerald-link link files")
      for (let i = 0; i < emeraldLinks.length; i++) {
        await processEmeraldLink(emeraldLinks[i])
      }
    }
  }
  const emeralds = await findFilesByExtension(outputFolder, '.emerald')
  if (emeralds.length > 0) {
    console.log("Populating the .emerald files")
    for (let i = 0; i < emeralds.length; i++) {
      await populateEmerald(emeralds[i], config.templateEngine)
    }
  }
  const emeraldScripts = await findFilesByExtension(outputFolder, '.emerald-script')
  if (emeraldScripts.length > 0) console.log("Running the emerald scripts")
  for (let i = 0; i < emeraldScripts.length; i++) {
    const scriptPath = emeraldScripts[i]
    await processEmeraldScript(scriptPath)
  }
}

module.exports = processOutputFolder
