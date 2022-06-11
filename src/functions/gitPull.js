const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

function gitPull(path) {
  return exec('git pull', { cwd: path })
}

module.exports = gitPull
