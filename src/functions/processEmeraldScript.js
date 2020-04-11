const {copy, readdir, rmdir, readFile, unlink} = require('fs-extra')
const {promisify} = require('util')
const {join, basename} = require('path')
const exec = promisify(require('child_process').exec)

async function processEmeraldScript(scriptPath) {
  const baseExtension = basename(scriptPath).split('.').splice(-2)[0]
  if (baseExtension === 'js') {
    try {
      let output = await require(scriptPath)
      if (typeof output == 'function') {
        output = await output()
      }
    } catch(error) {
      error.message = "The following error occured while processing a .emerald-script (this script will continue anyways): " + error.message
      console.error(error)
    }
  } else {
    const rawScript = await readFile(scriptPath, 'utf8')
    const lines = rawScript.split('\n').map(line => line.trim().filter(line => line.length > 0))
    for (let x = 0; x < lines.length; x++) {
      const line = lines[x]
      try {
        await exec(line, {cwd: join(scriptPath, '..')})
      } catch(error) {
        console.error(error)
      }
    }
  }
  await unlink(scriptPath)
}

module.exports = processEmeraldScript
