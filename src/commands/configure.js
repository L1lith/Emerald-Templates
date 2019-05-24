const askQuestion = require('../functions/askQuestion')
const resolvePath = require('../functions/resolvePath')
const {writeFileSync} = require('fs')
const {join} = require('path')
const directoryExists = require('directory-exists')

const configPath = join(__dirname, '..', '..', 'emerald-config.json')

async function configure(options) {
  let config = {}
  try {
    config = require(configPath)
  } catch(error) {}
  const templateFolderResponse = (await askQuestion("Please enter the path to your templates storage folder\n> ")).trim()
  if (templateFolderResponse.length > 0) {
    const templateFolder = resolvePath(templateFolderResponse, process.cwd())
    if (!(await directoryExists(templateFolder))) throw new Error(`The folder "${templateFolder}" does not exist`)
    console.log(`Setting the templates folder path as "${templateFolder}"`)
    config.templateFolder = templateFolder
  }

  writeFileSync(configPath, JSON.stringify(config))
  console.log("Emerald Templates Configured.")
}

module.exports = configure
