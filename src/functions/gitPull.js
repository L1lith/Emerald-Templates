const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

function gitPull(path, or = 'origin', branch = 'master') {
  return exec(`git pull ${or} ${branch}`, { cwd: path })
}

module.exports = gitPull
