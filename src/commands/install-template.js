const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const addTemplate = require('./add-template').handler
const { join } = require('path')

const destinationRegex = /(?<=Cloning into ')[^']+(?='[^\n]*\n$)/

async function installTemplate(url, dir) {
  const output = await exec(`git clone "${url}"`, { cwd: dir })
  let destination = output.stderr.match(destinationRegex)
  if (destination === null)
    throw new Error('It seems there was an issue with cloning: ' + output.stderr)
  destination = join(dir, destination[0])
  addTemplate(destination)
}

const remoteRegex = /^(git|http(?:s)?):\/\//

module.exports = {
  handler: installTemplate,
  args: {
    url: {
      argsPosition: 0,
      format: { _: String, trimmed: true, regex: remoteRegex },
      required: true
    },
    dir: {
      argsPosition: 1,
      format: String,
      default: process.cwd()
    }
  },
  aliases: ['install']
}
