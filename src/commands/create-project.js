const { join, basename, dirname } = require('path')
const sanitize = require('sanitize-filename')
const chalk = require('chalk')
const { promisify } = require('util')
const rimraf = require('delete').promise
const exec = promisify(require('child_process').exec)
const { copy, readdir, rmdir, readFile, unlink, pathExists, ensureDir } = require('fs-extra')
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
const { output } = require('../boilerplate/argsAliases')
const spawnAsync = require('../functions/spawnAsync')
const getProjectStore = require('../functions/getProjectStore')
const exists = require('../functions/exists')

const pathSpacingRegex = /[\s\-]+/g
const validPreexistingOptions = ['overwrite', 'erase', 'stop', 'available']

async function createProject(templateFolder, outputFolder, options) {
  const config = (process.env.EMERALD_CONFIG = getConfiguration())
  let { launchCommand } = config

  // const rootTemplateFolder = config.templateFolder
  // if (!(await directoryExists(rootTemplateFolder))) throw new Error("The folder configured to contain the templates does not exist")
  while (!templateFolder) templateFolder = await askQuestion(chalk.green('') + '\n> ')
  if (Array.isArray(templateFolder)) templateFolder = templateFolder[0]
  if (typeof templateFolder != 'string')
    throw new Error('Please specify which template folder you would like to use')
  const templateFolderPath = (await directoryExists(templateFolder))
    ? templateFolder
    : await findTemplateFolder(templateFolder)
  if (templateFolderPath === null)
    throw new Error(
      chalk.bold(`Could not find the template ${chalk.red('"' + templateFolder + '"')}`)
    )
  process.env.TEMPLATE_FOLDER = templateFolderPath

  /*let outputFolder =
    options['project'] ||
    options['projectPath'] ||
    (Array.isArray(options._) && options._.length >= 2
      ? options._.slice(1).join(' ')
      : await askQuestion(chalk.green() + '\n> ')) */
  if (Array.isArray(outputFolder)) outputFolder = outputFolder[0]
  if (typeof outputFolder != 'string') throw new Error('You must specify the output folder')
  // .replace(/\s+/g, '-')
  let outputFolderPath = resolvePath(outputFolder, process.cwd())
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

  process.env.OUTPUT_FOLDER = outputFolderPath
  const exists = await directoryExists(outputFolderPath)
  let overwriteMode = null
  if (exists) {
    //throw new Error(`The output folder "${outputFolderPath}" already exists and is not empty.`)
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
  console.log(templateFolderPath, outputFolderPath)
  await copyTemplate(templateFolderPath, outputFolderPath, {
    overwrite: overwriteMode === 'overwrite'
  })
  if (!silent) console.log('Generating the default emerald config')
  const projectConfig = await getEmeraldConfig(outputFolderPath, {
    generateDefaultConfig: true,
    defaultOptions: {
      sources: [templateFolder]
    }
  }) // Generate the default .emerald-config.json

  if (!silent) {
    console.log(
      chalk.green('The project has been named ') + chalk.cyan('"' + projectConfig.name + '"')
    )
    console.log('Handling any scripts, links, etc')
  }
  global.PROJECT_STORE = getProjectStore(outputFolderPath, projectConfig)

  await processOutputFolder(outputFolderPath, templateFolderPath, { silent })
  let packageJSON = null
  try {
    packageJSON = require(join(outputFolderPath, 'package.json'))
  } catch (error) {
    if (!silent) console.log('Could not find or access the package.json')
  }
  if (config.automaticallyInstallDependencies !== false && packageJSON) {
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
  if (!silent) console.log(chalk.green('Project Generated Successfully!'))
}

module.exports = {
  handler: createProject,
  aliases: ['generate', 'gen', 'g'],
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
