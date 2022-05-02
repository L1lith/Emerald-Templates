const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const { join } = require('path')
const { pathExistsSync } = require('fs-extra')
const tryRequire = require('./tryRequire')

const scriptDependenciesDir = join(__dirname, '..', '..', 'script-dependencies')

async function installScriptDependency(dependency, installDir) {
  if (!pathExistsSync(join(scriptDependenciesDir, dependency))) {
    console.log('Installing Script Dependency: ' + dependency)
    await exec('npm install ' + dependency, { cwd: scriptDependenciesDir })
  }
  await exec('npm link', { cwd: join(scriptDependenciesDir, 'node_modules', dependency) })
  console.log('b')
  await exec(`npm link "${dependency}"`, { cwd: installDir })
}

module.exports = installScriptDependency
