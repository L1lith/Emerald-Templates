const args = require('yargs').argv
const Mustache = require('mustache')
const Handlebars = require('handlebars')
const {readFile, writeFile, unlink} = require('fs-extra')

async function populateEmerald(filePath, templateEngine="handlebars") {
  const outputFilePath = filePath.replace(/.emerald$/, '')
  const rawFile = await readFile(filePath, 'utf8')
  let output
  if (templateEngine === "mustache") {
    output = Mustache.render(rawFile, args)
  } else if (templateEngine === "handlebars") {
    output = Handlebars.compile(rawFile)(args)
  } else {
    throw new Error("Unrecognized template engine")
  }
  await writeFile(outputFilePath, output)
  await unlink(filePath)
}

module.exports = populateEmerald
