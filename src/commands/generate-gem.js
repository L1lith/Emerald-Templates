const getEmeraldConfig = require('../functions/getEmeraldConfig')
const findGem = require('../functions/findGem')
const resolvePath = require('../functions/resolvePath')
const askQuestion = require('../functions/askQuestion')
const processOutputFolder = require('../functions/processOutputFolder')
const copyTemplate = require('../functions/copyTemplate')
const chalk = require('chalk')
const { inspect } = require('util')
const { join } = require('path')

async function generateGem(options) {
  const dir = process.cwd()
  let gemName =
    (options['generate-gem'] || options._ || [])[0] ||
    (await askQuestion('Which gem would you like to use?\n> '))
  if (typeof gemName !== 'string')
    throw new Error('Must supply a valid gem name string, got: ' + inspect(gemName))
  gemName = gemName.trim()
  if (gemName.length < 1) throw new Error('The gem name string must not be empty')
  let projectPath = options.hasOwnProperty('project')
    ? resolvePath(options.project, dir)
    : options._.length >= 2
    ? options._[1]
    : dir

  const gem = await findGem(projectPath, gemName)
  if (gem === null) throw new Error('Could not find a matching gem')
  console.log('Found the gem! Cloning the contents.')
  const destination = join(projectPath, gem.destination)
  await copyTemplate(gem.path, destination, {
    overwrite: false,
    allowGems: true
  })
  console.log('Handling any scripts, links, etc')
  await processOutputFolder(projectPath, gem.path)
  console.log(chalk.green('Gem Generated Successfully!'))
}

module.exports = {
  aliases: ['gem'],
  handler: generateGem
}
