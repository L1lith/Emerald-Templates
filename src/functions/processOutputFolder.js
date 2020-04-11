const {join, basename} = require('path')
const findFilesByExtension = require('../functions/findFilesByExtension')
const processEmeraldLink = require('./processEmeraldLink')
const populateEmerald = require('./populateEmerald')
const {copy, readdir, rmdir, readFile, unlink} = require('fs-extra')
const {promisify} = require('util')
const exec = promisify(require('child_process').exec)

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
    const rawScript = await readFile(emeraldScripts[i], 'utf8')
    const lines = rawScript.split('\n').map(line => line.trim())
    for (let x = 0; x < lines.length; x++) {
      const line = lines[x]
      if (line.length < 1) continue
      const baseExtension = basename(scriptPath).split('.').splice(-2)[0]
      if (baseExtension === 'js') {
        try {
          require(scriptPath)
        } catch(error) {
          console.error(error)
        }
      } else {
        try {
          await exec(line, {cwd: join(scriptPath, '..')})
        } catch(error) {
          console.error(error)
        }
      }
    }
    await unlink(scriptPath)
  }
}

module.exports = processOutputFolder
