const getEmeraldConfig = require('../functions/getEmeraldConfig')
const findGem = require('../functions/findGem')
const resolvePath = require('../functions/resolvePath')
const processOutputFolder = require('../functions/processOutputFolder')
const findProjectRoot = require('../functions/findProjectRoot')
const copyTemplate = require('../functions/copyTemplate')
const chalk = require('chalk')
const { inspect } = require('util')
const { join } = require('path')
const { argPrompt } = require('command-functions')
const getProjectStore = require('../functions/getProjectStore')
const installScriptDependency = require('../functions/installScriptDependency')
const remoteRegex = /^(git|http(?:s)?):\/\//
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const tmp = require('tmp')

async function generateGem(gemName, project) {
  const dir = process.cwd()
  if (typeof project == 'string') {
    project = resolvePath(project, dir)
  } else {
    project = dir
  }
  project = await findProjectRoot(project)
  if (!project) throw new Error('Could not find the "emerald-config.js" file')
  let gem = null
  if (typeof gemName != 'string')
    throw new Error('Must supply a valid gem name string, got: ' + inspect(gemName))
  let tempObj = null
  let tempDir = null
  if (remoteRegex.text(gemName)) {
    // It's actually a remote gem, begin clone process
    const url = new URL(gemName)
    console.log('Cloning the repository to use as a template')
    tempObj = tmp.dirSync()
    tempDir = tempObj.name
    console.log('x', tempDir)
    await exec(`git clone "${url}" target`, { cwd: tempDir })
    gem = join(tempDir, 'target')
  } else {
    gemName = gemName.trim()
    if (gemName.length < 1) throw new Error('The gem name string must not be empty')
    let projectPath = project ? resolvePath(project, dir) : dir

    gem = await findGem(projectPath, gemName)
  }
  if (gem === null) throw new Error('Could not find a matching gem')
  const config = await getEmeraldConfig(gem.path, { type: 'gem' })
  let argsOutput = {}
  let store = null
  // TODO: Use config.dependencies
  global.GEMSTORE = getProjectStore(projectPath, config)
  //process.env.GEMSTORE = store
  if ('args' in config) {
    Object.entries(config.args).forEach(([arg, argConfig]) => {
      const value = argPrompt(argConfig.prompt, argConfig)
      process.env['GEM_' + arg] = argsOutput[arg] = value
      if (store !== null) store[arg] = value
    })
  }
  global.GEMARGS = argsOutput
  //process.env.GEMARGS = argsOutput
  console.log('Found the gem! Cloning the contents.')
  const destination = join(projectPath, gem.destination)
  await copyTemplate(gem.path, destination, {
    overwrite: false,
    allowGems: true
  })
  if (Array.isArray(config.dependencies) && config.dependencies.length > 0) {
    await Promise.all(
      config.dependencies.map(dependency => {
        return installScriptDependency(dependency, destination)
      })
    )
  }
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
