const { copy, readdir, rmdir, readFile, exists } = require('fs-extra')
const rimraf = require('delete').promise
const { promisify } = require('util')
const { join, basename, dirname } = require('path')
//const exec = promisify(require('child_process').exec)
const { exec } = require('shelljs')
const args = require('./getArgs')()
const ensureArguments = require('./ensureArguments')
const findFilesByExtension = require('../functions/findFilesByExtension')
const { TempInstaller } = require('fly-install')
const spawnAsync = require('./spawnAsync')

const installer = new TempInstaller()
const packageNameRegex = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/

async function processEmeraldScript(scriptPath, options) {
  const silent = !!options?.silent
  const scriptDirectory = dirname(scriptPath)
  const baseExtension = basename(scriptPath).split('.').splice(-2)[0]
  const rawScript = await readFile(scriptPath, 'utf8')
  const lines = rawScript
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
  if (baseExtension === 'js' || baseExtension === 'mjs') {
    // let config = null
    // // get the config
    // for (let i = 0; i < 1 /*lines.length*/; i++) {
    //   const line = lines[i].trim()
    //   if (line.startsWith('//@')) {
    //     const configContent = `(${line.slice(3)})`
    //     try {
    //       config = eval(configContent)
    //     } catch (error) {
    //       error.message =
    //         'Could not parse config line inside .emerald-script, ignoring. Error: ' + error.message
    //       console.error(error)
    //     }
    //     break
    //   }
    // }

    // if (typeof config == 'object') {
    //   let args = []
    //   const getInput = new CommandFunction({
    //     ...config,
    //     handler: (...receivedArgs) => {
    //       args = receivedArgs
    //     }
    //   })
    //   await getInput.runCLI([]) // Args should be set now
    //   process.env.GEM_ARGS = args
    // }
    // // handle the config
    const dependenciesToRemove = []
    try {
      let output = await require(scriptPath)
      if (typeof output == 'function') {
        output = output()
      }
      output = await output
    } catch (error) {
      error.message =
        'The following error occured while processing a .emerald-script (this script will continue anyways): ' +
        error.message
      console.error(error)
    }
    if (dependenciesToRemove.length > 0) {
      if (!silent) console.log('Uninstalling Temporary Dependencies')
      for (const dependency of dependenciesToRemove) {
        await spawnAsync('npm uninstall ' + dependency, {
          cwd: scriptDirectory,
          async: true,
          silent: true
        })
      }
    }
  } else {
    for (let x = 0; x < lines.length; x++) {
      const line = lines[x]
      try {
        await spawnAsync(line, { cwd: join(scriptPath, '..'), async: true, silent: false })
      } catch (error) {
        console.error(error)
      }
    }
  }
  await rimraf(scriptPath)
  //delete process.env.EMERALD_SCRIPT_ARGS
}

async function processEmeraldScripts(
  outputFolder,
  templateFolder,
  projectConfig,
  firstRun,
  options
) {
  const emeraldScripts = await findFilesByExtension(outputFolder, ['.emerald-script', '.emscript'])
  if (emeraldScripts.length > 0)
    if (!options.silent) console.log(`Running ${firstRun ? 'the' : 'additional'} emerald scripts`)
  for (let i = 0; i < emeraldScripts.length; i++) {
    const scriptPath = emeraldScripts[i]
    await processEmeraldScript(scriptPath, options)
  }
  return emeraldScripts.length
}

module.exports = processEmeraldScripts
