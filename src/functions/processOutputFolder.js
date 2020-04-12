const findFilesByExtension = require('../functions/findFilesByExtension')
const processEmeraldLink = require('./processEmeraldLink')
const populateEmerald = require('./populateEmerald')
const processEmeraldScript = require('./processEmeraldScript')

async function processOutputFolder(outputFolder) {
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
