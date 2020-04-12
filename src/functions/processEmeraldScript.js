const {copy, readdir, rmdir, readFile, unlink, exists} = require('fs-extra')
const {promisify} = require('util')
const {join, basename, dirname} = require('path')
const exec = promisify(require('child_process').exec)
const args = require('yargs').argv
const ensureArguments = require('./ensureArguments')

const packageNameRegex = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/

async function processEmeraldScript(scriptPath) {
  process.env.EMERALD_ARGS = args
  const scriptDirectory = dirname(scriptPath)
  const baseExtension = basename(scriptPath).split('.').splice(-2)[0]
  const rawScript = await readFile(scriptPath, 'utf8')
  const lines = rawScript.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  if (baseExtension === 'js') {
    let config = null
    // get the config
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.length > 0) {
        if (line.startsWith('//@')) {
          try {
            config = JSON.parse(line.slice(3))
          } catch(error) {
            error.message = "Could not parse config line inside .emerald-script, ignoring. Error: " + error.message
            console.error(error)
          }
        }
        break
      }
    }
    // handle the config
    const dependenciesToRemove = []
    if (config !== null) {
      const {dependencies, requiredArguments} = config
      if (config.hasOwnProperty('requiredArguments')) {
        ensureArguments(requiredArguments)
      }
      if (config.hasOwnProperty("dependencies")) {
        if (!Array.isArray(dependencies)) throw new Error("Dependencies must be an array")
        if (dependencies.some(value => typeof value != 'string' || !(packageNameRegex.test(value)))) throw new Error("All dependencies must be valid package name strings")
        console.log("Installing "+ dependencies.length +" Temporary Dependencies")
        for (let i = 0; i < dependencies.length; i++) {
          const dependency = dependencies[i]
          let exists = false
          try {
            exists = await exists(join(scriptDirectory, 'node_modules', dependency))
          } catch(error) {/* do nothing*/}
          if (exists !== true) { // do a temp install
            await exec('npm install --prefix ./ ' + dependency, {
              cwd: scriptDirectory
            })
            dependenciesToRemove.push(dependency)
          }
        }
      }
    }
    try {
      let output = await require(scriptPath)
      if (typeof output == 'function') {
        output = await output()
      }
    } catch(error) {
      error.message = "The following error occured while processing a .emerald-script (this script will continue anyways): " + error.message
      console.error(error)
    }
    for (let i = 0; i < dependenciesToRemove.length; i++) {
      const dependency = dependenciesToRemove[i]
      await exec('npm uninstall ' + dependency, {
        cwd: scriptDirectory
      })
    }
  } else {
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
