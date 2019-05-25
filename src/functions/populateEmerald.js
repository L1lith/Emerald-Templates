const args = require('yargs').argv
const Mustache = require('mustache')
const {readFile, writeFile, unlink} = require('fs-extra')

async function populateEmerald(filePath, templateEngine="mustache") {
  const outputFilePath = filePath.replace(/.emerald$/, '')
  const rawFile = await readFile(filePath, 'utf8')
  let output
  if (templateEngine === "mustache") {
    output = Mustache.render(rawFile, args)
  } else {
    throw new Error("Unrecognized template engine")
  }
  await writeFile(outputFilePath, output)
  await unlink(filePath)
}

module.exports = populateEmerald
