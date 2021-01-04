const Mustache = require('mustache')
const ejs = require('ejs')
const Handlebars = require('handlebars')
const nunjucks = require('nunjucks')
const { basename, relative, dirname, extname } = require('path')
const { readFile, writeFile } = require('fs-extra')
const { readFileSync } = require('fs')
const rimraf = require('delete').promise
const findFilesByExtension = require('../functions/findFilesByExtension')
const getConfiguration = require('./getConfiguration')
const args = require('./getArgs')()

async function populateEmerald(outputFolder, filePath, templateEngine = 'ejs') {
  const sourceFile = filePath
  const rawFile = await readFile(filePath, 'utf8')
  filePath = filePath.replace(/.emerald$/, '')
  const relativePath = relative(outputFolder, filePath)
  const fileName = basename(filePath, extname(filePath))
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
  let output
  if (templateEngine === 'mustache') {
    output = Mustache.render(rawFile, scriptArgs)
  } else if (templateEngine === 'handlebars') {
    output = Handlebars.compile(rawFile)(scriptArgs)
  } else if (templateEngine === 'ejs') {
    output = ejs.render(rawFile, scriptArgs)
  } else if (templateEngine === 'nunjucks') {
    output = nunjucks.renderString(rawFile, scriptArgs)
  } else {
    throw new Error('Unrecognized template engine')
  }
  await writeFile(filePath, output)
  await rimraf(sourceFile)
}

async function populateEmeralds(outputFolder, templateFolder, projectConfig, firstRun) {
  const config = getConfiguration()
  const emeralds = await findFilesByExtension(outputFolder, '.emerald')
  if (emeralds.length > 0) {
    console.log(`Populating ${firstRun ? 'the' : 'additional'} .emerald files`)
    for (const emerald of emeralds) {
      await populateEmerald(outputFolder, emerald, config.templateEngine)
    }
  }
  return emeralds.length
}

module.exports = populateEmeralds
