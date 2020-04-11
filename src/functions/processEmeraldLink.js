const {basename, dirname, join} = require('path')
const {readFile} = require('fs-extra')

async function processEmeraldLink(linkPath) {
  const fileName = basename(linkPath)
  const outputFolder = dirname(linkPath)
  if (fileName.length < 1) throw new Error("Emerald Link Error, Filename not given")
  const output = join(outputFolder, fileName)
  const sourceCode = (await readFile(linkPath)).toString()
  const sourceLines = sourceCode.split(/[\n\,]+/g).map(line => line.trim()).filter(line => line.length > 0 && !line.startsWith('#')) // ignore comment lines
  if (sourceLines.length < 0) throw new Error("Must supply a source path")
  const [source] = sourceLines
}

module.exports = processEmeraldLink
