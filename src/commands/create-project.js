const { join, basename, dirname } = require('path')
const chalk = require('chalk')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const rimraf = require('delete').promise
const { mkdir, cleanup, track } = require('temp')
const { pathExists, ensureDir } = require('fs-extra')
const getConfiguration = require('../functions/getConfiguration')
const directoryExists = require('directory-exists')
const resolvePath = require('../functions/resolvePath')
const saveGlobalConfig = require('../functions/saveGlobalConfig')
const processOutputFolder = require('../functions/processOutputFolder')
const copyTemplate = require('../functions/copyTemplate')
const findTemplateFolder = require('../functions/findTemplateFolder')
const askQuestion = require('../functions/askQuestion')
const askYesOrNo = require('../functions/askYesOrNo')
//const displayList = require('../functions/displayList')
const getEmeraldConfig = require('../functions/getEmeraldConfig')
const getProjectStore = require('../functions/getProjectStore')
const gitPull = require('../functions/gitPull')
const installScriptDependency = require('../functions/installScriptDependency')

const pathSpacingRegex = /[\s-]+/g
const remoteRegex = /^(git|http(?:s)?):\/\//
const validPreexistingOptions = ['overwrite', 'erase', 'stop', 'available']

async function createProject(templateFolder, outputFolder, options) {
  const env = {}
  const config = (env.EMERALD_CONFIG = getConfiguration())
  let { launchCommand } = config

  let tempDir = null
  if (remoteRegex.test(templateFolder)) {
    // Remote Repo
    track(true)
    const url = new URL(templateFolder)
    console.log('Cloning the repository to use as a template')
    tempDir = await mkdir('remote-template')
    await exec(`git clone "${url}" target`, { cwd: tempDir })
    templateFolder = join(tempDir, 'target')
  }

  const templateConfig = await findTemplateFolder(templateFolder)
  if (tempDir === null) {
    // Update the template
    console.log('Checking for updates')
    await gitPull(templateConfig.path)
  }
  if (templateConfig === null) throw new Error('Could not find the template: ' + templateFolder)
  env.TEMPLATE_FOLDER = templateConfig.path
  if (Array.isArray(outputFolder)) outputFolder = outputFolder[0]
  if (typeof outputFolder != 'string') throw new Error('You must specify the output folder')
  let outputFolderPath = resolvePath(outputFolder, process.cwd())
  // strip the spaces
  outputFolderPath = join(
    dirname(outputFolderPath),
    basename(outputFolderPath).trim().toLowerCase().replace(pathSpacingRegex, '-')
  )
  const parentDirectory = join(outputFolderPath, '..')
  await ensureDir(parentDirectory)

  const silent = !!options.silent

  if (!silent)
    console.log(
      chalk.green('Creating a new project at ') + chalk.cyan('"' + outputFolderPath + '"')
    )

  env.OUTPUT_FOLDER = outputFolderPath
  const exists = await directoryExists(outputFolderPath)
  let overwriteMode = null
  if (exists) {
    while (!validPreexistingOptions.includes(overwriteMode))
      overwriteMode = (
        await askQuestion(
          'That folder already exists, how would you like to proceed?\nOptions: \n- ' +
            validPreexistingOptions.join(', ') +
            '\n> '
        )
      )
        .toLowerCase()
        .trim()
    if (overwriteMode === 'erase') {
      if (options.force !== true) {
        const answer = await askYesOrNo(
          // eslint-disable-next-line quotes
          "Are you sure you'd like to erase the entire project? (yes/no)\n> "
        )
        if (answer === false) {
          if (!silent) console.log('Exiting...')
          process.exit(0)
        }
      }
      await rimraf(outputFolderPath)
    } else if (overwriteMode === 'available') {
      // Do Nothing
    } else if (overwriteMode === 'stop') {
      throw new Error('Stop requested')
    }
  }
  if (!silent) console.log('Copying The Template')
  await copyTemplate(templateConfig.path, outputFolderPath, {
    overwrite: overwriteMode === 'overwrite'
  })
  if (!silent) console.log('Generating the default emerald config')
  const projectConfig = await getEmeraldConfig(outputFolderPath, {
    generateDefaultConfig: true,
    defaultOptions: {
      sources: [templateConfig.path]
    }
  }) // Generate the default .emerald-config.json

  if (!silent) {
    console.log(
      chalk.green('The project has been named ') + chalk.cyan('"' + projectConfig.name + '"')
    )
    console.log('Handling any scripts, links, etc')
  }
  env.PROJECT_STORE = getProjectStore(outputFolderPath, projectConfig)
  // Assign our env
  Object.assign(process.env, env)
  Object.assign(global, env)
  if (Array.isArray(templateConfig.installDependencies)) {
    templateConfig.installDependencies
      .map(value => (typeof value == 'string' ? value.trim() : value))
      .filter(value => typeof value == 'string')
      .forEach(dependency => {
        installScriptDependency(dependency, outputFolderPath)
      })
  }
  await processOutputFolder(outputFolderPath, templateConfig.path, { silent })
  let packageJSON = null
  try {
    packageJSON = require(join(outputFolderPath, 'package.json'))
  } catch (error) {
    if (!silent) console.log('Could not find or access the package.json')
  }
  if (!options.noInstall && config.automaticallyInstallDependencies !== false && packageJSON) {
    if (!silent) console.log('Installing Dependencies')
    await exec('npm install', { cwd: outputFolderPath })
  }
  if (config.automaticallyInitializeGitRepo === true) {
    if (!silent) console.log('Initializing Git Repository')
    if (!(await pathExists(join(outputFolderPath, '.git'))))
      await exec('git init .', { cwd: outputFolderPath })
  }
  if (options.noLaunch !== true && typeof launchCommand == 'string') {
    launchCommand = launchCommand.trim()
    if (launchCommand.length > 0) {
      if (!silent) console.log('Running Launch Command')
      await exec(launchCommand, { cwd: outputFolderPath, shell: true })
    } else {
      console.warn('Invalid Launch Command')
    }
  }
  const { projectFolders } = config
  if (!projectFolders.includes(outputFolderPath)) {
    config.projectFolders = projectFolders.concat([outputFolderPath])
    saveGlobalConfig(config)
  }
  if (tempDir !== null) {
    await cleanup()
    track(false)
  }
  if (!silent) console.log(chalk.green('Project Generated Successfully!'))
}

module.exports = {
  handler: createProject,
  aliases: ['generate', 'gen', 'g', 'clone', 'create'],
  allowBonusArgs: true,
  spreadArgs: true,
  args: {
    templateFolder: {
      format: String,
      argsPosition: 0,
      prompt: 'Which template would you like to use?',
      required: true
    },
    outputFolder: {
      format: String,
      argsPosition: 1,
      prompt: 'What would you like to name the project?',
      required: true
    },
    noLaunch: {
      format: Boolean,
      default: false
    }
  }
}
