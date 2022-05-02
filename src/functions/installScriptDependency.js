const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const { join } = require('path')
const { pathExists, ensureSymlink } = require('fs-extra')
const scriptDependenciesDir = join(__dirname, '..', '..', 'script-dependencies')

async function installScriptDependency(dependency, installDir) {
  const modulePath = join(scriptDependenciesDir, 'node_modules', dependency)
  const moduleDestination = join(installDir, 'node_modules', dependency)
  if (await pathExists(moduleDestination)) return
  if (!(await pathExists(modulePath))) {
    console.log('Installing Script Dependency: ' + dependency)
    await exec('npm install ' + dependency, { cwd: scriptDependenciesDir })
  }
  await ensureSymlink(modulePath, moduleDestination)
  //await exec('npm link', { cwd: join(scriptDependenciesDir, 'node_modules', dependency) })
}

module.exports = installScriptDependency
