const { join, basename } = require('path')
const sanitize = require('sanitize-filename')
const chalk = require('chalk')
const { promisify } = require('util')
const rimraf = require('delete').promise
const exec = promisify(require('child_process').exec)
const { copy, readdir, rmdir, readFile, unlink, pathExists } = require('fs-extra')
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

const validPrexistingOptions = ['overwrite', 'erase', 'stop', 'available']

async function generate(options) {
  const config = (process.env.EMERALD_CONFIG = getConfiguration())
  let { launchCommand } = config

  // const rootTemplateFolder = config.templateFolder
  // if (!(await directoryExists(rootTemplateFolder))) throw new Error("The folder configured to contain the templates does not exist")
  console.log(options)
  let templateFolder =
    (
      (options.hasOwnProperty('create-project') ? options['create-project'][0] : undefined) || ''
    ).trim() || (await askQuestion(chalk.green('Which template would you like to use?') + '\n> '))
  if (!templateFolder) throw new Error('Please specify which template folder you would like to use')
  const templateFolderPath = await findTemplateFolder(templateFolder)
  if (templateFolderPath === null || !(await directoryExists(templateFolderPath)))
    throw new Error(
      chalk.bold(`Could not find the template ${chalk.red('"' + templateFolder + '"')}`)
    )
  process.env.TEMPLATE_FOLDER = templateFolderPath

  let outputFolder =
    (Array.isArray(options['create-project'])
      ? options['create-project']
      : [options['create-project']]
    )
      .slice(1)
      .join(' ')
      .trim() ||
    (await askQuestion(chalk.green('What would you like to name the project?') + '\n> '))
  if (!outputFolder) throw new Error('You must specify the output folder')
  const outputFolderPath = resolvePath(sanitize(outputFolder.replace(/\s+/g, '-')), process.cwd())
  if (!(await directoryExists(join(outputFolderPath, '..'))))
    throw new Error(`The output folder's parent directory does not exist`)

  console.log(chalk.green('Creating a new project at ') + chalk.cyan('"' + outputFolderPath + '"'))

  process.env.OUTPUT_FOLDER = outputFolderPath
  const exists = await directoryExists(outputFolderPath)
  let overwriteMode = null
  if (exists) {
    //throw new Error(`The output folder "${outputFolderPath}" already exists and is not empty.`)
    while (!validPrexistingOptions.includes(overwriteMode))
      overwriteMode = (
        await askQuestion(
          'That folder already exists, how would you like to proceed?\nOptions: \n- ' +
            validPrexistingOptions.join(', ') +
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
          console.log('Exiting...')
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
  console.log('Copying The Template')
  await copyTemplate(templateFolderPath, outputFolderPath, {
    overwrite: overwriteMode === 'overwrite'
  })
  console.log('Generating the default emerald config')
  const projectConfig = await getEmeraldConfig(outputFolderPath, {
    generateDefaultConfig: true,
    defaultConfigOptions: {
      sources: [templateFolderPath]
    }
  }) // Generate the default .emerald-config.json
  console.log(
    chalk.green('The project has been named ') + chalk.cyan('"' + projectConfig.name + '"')
  )
  console.log('Handling any scripts, links, etc')
  await processOutputFolder(outputFolderPath, templateFolderPath)
  let packageJSON = null
  try {
    packageJSON = require(join(outputFolderPath, 'package.json'))
  } catch (error) {
    console.log('Could not find or access the package.json')
  }
  if (config.automaticallyInstallDependencies !== false && packageJSON) {
    console.log('Installing Dependencies')
    await exec('npm install', { cwd: outputFolderPath })
  }
  if (config.automaticallyInitializeGitRepo === true) {
    console.log('Initializing Git Repository')
    if (!(await pathExists(join(outputFolderPath, '.git'))))
      await exec('git init .', { cwd: outputFolderPath })
  }
  if (typeof launchCommand == 'string') {
    launchCommand = launchCommand.trim()
    if (launchCommand.length > 0) {
      console.log('Running Launch Command')
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
  console.log(chalk.green('Project Generated Successfully!'))
}

module.exports = generate