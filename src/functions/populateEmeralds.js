const args = require('yargs').argv
const Mustache = require('mustache')
const ejs = require('ejs')
const Handlebars = require('handlebars')
const nunjucks = require('nunjucks')
const {readFile, writeFile, unlink} = require('fs-extra')
const findFilesByExtension = require('../functions/findFilesByExtension')

async function populateEmerald(filePath, templateEngine="handlebars") {
  const outputFilePath = filePath.replace(/.emerald$/, '')
  const rawFile = await readFile(filePath, 'utf8')
  let output
  if (templateEngine === "mustache") {
    output = Mustache.render(rawFile, args)
  } else if (templateEngine === "handlebars") {
    output = Handlebars.compile(rawFile)(args)
  } else if (templateEngine === "ejs") {
    output = ejs.render(rawFile, args)
  } else if (templateEngine === "nunjucks") {
    output = nunjucks.renderString(rawFile, args)
  } else {
    throw new Error("Unrecognized template engine")
  }
  await writeFile(outputFilePath, output)
  await unlink(filePath)
}

async function populateEmeralds(outputFolder) {
  const emeralds = await findFilesByExtension(outputFolder, '.emerald')
  if (emeralds.length > 0) {
    console.log("Populating the .emerald files")
    for (const emerald of emeralds) {
      await populateEmerald(emerald, config.templateEngine)
    }
  }
  return emeralds.length
}

module.exports = populateEmeralds
