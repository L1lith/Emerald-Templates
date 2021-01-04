const { copy, readdir, rmdir, readFile, exists } = require('fs-extra')
const rimraf = require('delete').promise
const { promisify } = require('util')
const { join, basename, dirname } = require('path')
const exec = promisify(require('child_process').exec)
const args = require('./getArgs')()
const ensureArguments = require('./ensureArguments')
const findFilesByExtension = require('../functions/findFilesByExtension')

const packageNameRegex = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/

async function processEmeraldScript(scriptPath) {
  const scriptDirectory = dirname(scriptPath)
  const baseExtension = basename(scriptPath).split('.').splice(-2)[0]
  const rawScript = await readFile(scriptPath, 'utf8')
  const lines = rawScript
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
  if (baseExtension === 'js') {
    let config = null
    // get the config
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.length > 0) {
        if (line.startsWith('//@')) {
          try {
            config = JSON.parse(line.slice(3))
          } catch (error) {
            error.message =
              'Could not parse config line inside .emerald-script, ignoring. Error: ' +
              error.message
            console.error(error)
          }
        }
        break
      }
    }
    // handle the config
    const dependenciesToRemove = []
    const scriptArgs =
      config !== null && config.hasOwnProperty('defaultArguments')
        ? { ...config.defaultArguments, ...args }
        : { ...args }
    if (config !== null) {
      const { dependencies, requiredArguments } = config
      if (config.hasOwnProperty('requiredArguments')) {
        ensureArguments(scriptArgs, requiredArguments)
      }
      if (config.hasOwnProperty('dependencies')) {
        if (!Array.isArray(dependencies)) throw new Error('Dependencies must be an array')
        if (dependencies.some(value => typeof value != 'string' || !packageNameRegex.test(value)))
          throw new Error('All dependencies must be valid package name strings')
        console.log('Installing ' + dependencies.length + ' Temporary Dependencies')
        for (const dependency of dependencies) {
          let exists = false
          try {
            exists = await exists(join(scriptDirectory, 'node_modules', dependency))
          } catch (error) {
            /* do nothing*/
          }
          if (exists !== true) {
            // do a temp install
            await exec('npm install --prefix ./ ' + dependency, {
              cwd: scriptDirectory
            })
            dependenciesToRemove.push(dependency)
          }
        }
      }
    }
    process.env.EMERALD_SCRIPT_ARGS = JSON.stringify(scriptArgs)
    try {
      let output = await require(scriptPath)
      if (typeof output == 'function') {
        output = await output()
      }
    } catch (error) {
      error.message =
        'The following error occured while processing a .emerald-script (this script will continue anyways): ' +
        error.message
      console.error(error)
    }
    if (dependenciesToRemove.length > 0) {
      console.log('Uninstalling Temporary Dependencies')
      for (const dependency of dependenciesToRemove) {
        await exec('npm uninstall ' + dependency, {
          cwd: scriptDirectory
        })
      }
    }
  } else {
    for (let x = 0; x < lines.length; x++) {
      const line = lines[x]
      try {
        await exec(line, { cwd: join(scriptPath, '..') })
      } catch (error) {
        console.error(error)
      }
    }
  }
  await rimraf(scriptPath)
  delete process.env.EMERALD_SCRIPT_ARGS
}

async function processEmeraldScripts(outputFolder, templateFolder, projectConfig, firstRun) {
  const emeraldScripts = await findFilesByExtension(outputFolder, '.emerald-script')
  if (emeraldScripts.length > 0)
    console.log(`Running ${firstRun ? 'the' : 'additional'} emerald scripts`)
  for (let i = 0; i < emeraldScripts.length; i++) {
    const scriptPath = emeraldScripts[i]
    await processEmeraldScript(scriptPath)
  }
  return emeraldScripts.length
}

module.exports = processEmeraldScripts
