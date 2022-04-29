const ejs = require('ejs')
const { relative, dirname } = require('path')
const { readFile, writeFile } = require('fs-extra')
const { readFileSync } = require('fs')
const rimraf = require('delete').promise
const findFilesByExtension = require('../functions/findFilesByExtension')
const getConfiguration = require('./getConfiguration')
const args = require('./getArgs')()

async function populateEmerald(outputFolder, filePath) {
  //const silent = !!options?.silent
  const sourceFile = filePath
  const rawFile = await readFile(filePath, 'utf8')
  filePath = filePath.replace(/.emerald$/, '')
  const relativePath = relative(outputFolder, filePath)
  //const fileName = basename(filePath, extname(filePath))
  const parentFolder = dirname(filePath)

  const location = {
    filePath,
    parentFolder,
    relativePath,
    outputFolder
  }
  const scriptArgs = {
    args,
    location,
    require: require,
    loadFile: path => readFileSync(path, 'uft8')
  }
  const output = ejs.render(rawFile, scriptArgs)
  await writeFile(filePath, output)
  await rimraf(sourceFile, { force: true })
}

async function populateEmeralds(
  outputFolder,
  templateFolder,
  projectConfig,
  firstRun,
  options = {}
) {
  const silent = !!options?.silent
  const config = getConfiguration()
  const emeralds = await findFilesByExtension(outputFolder, '.emerald')
  if (emeralds.length > 0) {
    if (!silent) console.log(`Populating ${firstRun ? 'the' : 'additional'} .emerald files`)
    for (const emerald of emeralds) {
      await populateEmerald(outputFolder, emerald, config.templateEngine)
    }
  }
  return emeralds.length
}

module.exports = populateEmeralds
