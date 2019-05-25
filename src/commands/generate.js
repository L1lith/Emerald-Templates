const {join} = require('path')
const getConfiguration = require('../functions/getConfiguration')
const directoryExists = require('directory-exists')
const resolvePath = require('../functions/resolvePath')
const {promisify} = require('util')
const {copy, readdir, rmdir} = require('fs-extra')
const populateEmerald = require('../functions/populateEmerald')
const findFilesByExtension = require('../functions/findFilesByExtension')
const exec = promisify(require('child_process').exec)

async function generate(options) {
  const config = getConfiguration()
  const rootTemplateFolder = config.templateFolder
  if (!(await directoryExists(rootTemplateFolder))) throw new Error("The folder configured to contain the templates does not exist")
  let templateFolder = (options['--template'] || options._[0] || "").trim()
  if (!templateFolder) throw new Error("Please specify which template folder you would like to use")
  templateFolder = join(rootTemplateFolder, templateFolder)
  if (!(await directoryExists(templateFolder))) throw new Error(`Could not find the template folder "${templateFolder}"`)

  let outputFolder = (options['--outputFolder'] || options._[1] || "").trim()
  if (!outputFolder) throw new Error("You must specify the output folder")
  outputFolder = resolvePath(outputFolder, process.cwd())
  if (!(await directoryExists(join(outputFolder, '..')))) throw new Error(`The output folder's parent directory does not exist`)
  const exists = await directoryExists(outputFolder)
  if (exists && (await readdir(outputFolder)).length > 0) throw new Error(`The output folder "${outputFolder}" already exists and is not empty.`)
  if (exists) {
    await rmdir(outputFolder)
  }
  console.log("Copying The Template")
  await copy(templateFolder, outputFolder)
  console.log("Populating the .emerald files")
  const emeralds = await findFilesByExtension(outputFolder, '.emerald')
  for (let i = 0; i < emeralds.length; i++) {
    await populateEmerald(emeralds[i], config.templateEngine)
  }
  let packageJSON = null
  try {
    packageJSON = require(join(outputFolder, "package.json"))
  } catch(error) {console.log(error)}
  if (config.automaticallyInstallNodeModules !== false && packageJSON && ((typeof packageJSON.dependencies == 'object' && Object.keys(packageJSON.dependencies).length > 0) || (typeof packageJSON.devDependencies == 'object' && Object.keys(packageJSON.devDependencies).length > 0))) {
    console.log("Detected missing dependencies, installing.")
    await exec("npm install", {cwd: outputFolder})
  }

  console.log("Project Generated!")

}

module.exports = generate
