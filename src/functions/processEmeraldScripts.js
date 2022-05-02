const { readFile } = require('fs-extra')
const rimraf = require('delete').promise
const { join, dirname, extname } = require('path')
//const exec = promisify(require('child_process').exec)
// const args = require('./getArgs')()
// const ensureArguments = require('./ensureArguments')
const findFilesByExtension = require('../functions/findFilesByExtension')
const spawnAsync = require('./spawnAsync')

// const installer = new TempInstaller()
// const packageNameRegex = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/

async function processEmeraldScript(scriptPath, options) {
  const silent = !!options?.silent
  const scriptDirectory = dirname(scriptPath)
  const extension = extname(scriptPath).split('.').splice(-1)[0]
  const rawScript = await readFile(scriptPath, 'utf8')
  const lines = rawScript
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
  if (extension === 'js' || extension === 'mjs') {
    const dependenciesToRemove = []
    try {
      let output = await require(scriptPath)
      if (typeof output == 'function') {
        output = output()
      }
      output = await output
    } catch (error) {
      error.message =
        'The following error occured while processing a .emerald-script (this command will continue anyways): ' +
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
        error.message = 'Error inside .emerald-script.js file: ' + error.message
        console.error(error)
        break // Stop running the script on the first failure
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
