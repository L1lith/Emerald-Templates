const findFilesByExtension = require('../functions/findFilesByExtension')
const {basename, dirname, join} = require('path')
const {readFile} = require('fs-extra')
const clone = require('@wrote/clone')
const areRelatedPaths = require("./areRelatedPaths")

async function processEmeraldLink(linkPath) {
  const fileName = basename(linkPath)
  const outputFolder = dirname(linkPath)
  if (fileName.length < 1) throw new Error("Emerald Link Error, Filename not given")
  const output = join(outputFolder, fileName)
  const sourceCode = (await readFile(linkPath)).toString()
  const sourceLines = sourceCode.split(/[\n\,]+/g).map(line => line.trim()).filter(line => line.length > 0 && !line.startsWith('#')) // ignore comment lines
  if (sourceLines.length < 0) throw new Error("Must supply a source path")
  const [source] = sourceLines
  await clone(source, output)
}

async function processEmeraldLinks(outputFolder) {
  let emeraldLinks = [null]
  while (emeraldLinks.length > 0) {
    emeraldLinks = await findFilesByExtension(outputFolder, '.emerald-link')
    if (emeraldLinks.length > 0) {
      console.log("Processing the .emerald-link link files")
      for (let i = 0; i < emeraldLinks.length; i++) {
        await processEmeraldLink(emeraldLinks[i])
      }
    }
  }
}

module.exports = processEmeraldLinks
