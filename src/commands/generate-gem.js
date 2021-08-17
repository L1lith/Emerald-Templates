const getEmeraldConfig = require('../functions/getEmeraldConfig')
const findGem = require('../functions/findGem')
const resolvePath = require('../functions/resolvePath')
const askQuestion = require('../functions/askQuestion')
const processOutputFolder = require('../functions/processOutputFolder')
const copyTemplate = require('../functions/copyTemplate')
const chalk = require('chalk')
const { inspect } = require('util')
const { join } = require('path')
const { argPrompt } = require('command-functions')

async function generateGem(gemName, project, options = {}) {
  const dir = process.cwd()
  if (typeof gemName != 'string')
    throw new Error('Must supply a valid gem name string, got: ' + inspect(gemName))
  gemName = gemName.trim()
  if (gemName.length < 1) throw new Error('The gem name string must not be empty')
  let projectPath = options.hasOwnProperty('project') ? resolvePath(project, dir) : dir

  const gem = await findGem(projectPath, gemName)
  if (gem === null) throw new Error('Could not find a matching gem')
  const config = await getEmeraldConfig(gem.path, { type: 'gem' })
  let argsOutput = {}
  if (config.hasOwnProperty('args')) {
    Object.entries(config.args).forEach(([arg, argConfig]) => {
      process.env['EM_' + arg] = argsOutput[arg] = argPrompt(argConfig.prompt, argConfig)
    })
  }
  global.EMARGS = global.EMERALD_ARGS = argsOutput
  process.env.EMERALD_ARGS = process.env.EMARGS = argsOutput
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
  args: {
    gem: {
      argsPosition: 0,
      format: String,
      prompt: 'Which gem would you like to use?',
      required: true
    },
    project: {
      argsPosition: 1,
      format: String
      //prompt: 'Which project would you like to apply the gem to?'
    }
  },
  aliases: ['gem'],
  handler: generateGem
}
