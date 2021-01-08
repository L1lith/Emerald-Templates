const findFilesByExtension = require('../functions/findFilesByExtension')
const { basename, dirname, join, relative, extname } = require('path')
const { readFile, exists } = require('fs-extra')
const areRelatedPaths = require('./areRelatedPaths')
const mkdirp = require('mkdirp')
const rimraf = require('delete').promise
const mvdir = require('mvdir')
const resolvePath = require('./resolvePath')
const smartCopy = require('./smartCopy')

const endingEmeraldLinkRegex = /\.emerald-link$/i

async function processEmeraldLink(linkPath, outputFolder, templateFolder) {
  const relativePath = relative(outputFolder, linkPath)
  const relativeLinkFolder = dirname(relativePath)
  const fileName = basename(linkPath, extname(linkPath))
  const linkFolder = dirname(linkPath)
  //if (fileName.length < 1) throw new Error("Emerald Link Error, Filename not given")
  const output = join(linkFolder, fileName.replace(endingEmeraldLinkRegex, ''))
  const sourceCode = (await readFile(linkPath)).toString()
  const sourceLines = sourceCode
    .split(/[\n\,]+/g)
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#')) // ignore comment lines
  if (sourceLines.length < 0) throw new Error('Must supply a source path')
  let [source] = sourceLines
  source = source.replace(/\{OUTPUT_FOLDER\}/g, outputFolder)
  source = source.replace(/\{OUTPUT_PATH\}/g, output)
  source = source.replace(/\{TEMPLATE_FOLDER\}/g, templateFolder)
  source = source.replace(/\{LINK_FOLDER\}/g, linkFolder)
  source = source.replace(/\{LINK_RELATIVE_FOLDER\}/g, relativeLinkFolder)
  source = source.replace(/\{RELATIVE_PATH\}/g, relativePath)
  source = resolvePath(source, relativeLinkFolder)
  if (areRelatedPaths(source, output))
    throw new Error(`Cannot clone related paths: "${source}", "${output}"`)
  await mkdirp(linkFolder)
  await rimraf(linkPath)
  await smartCopy(source, output, { templateOptions: { overwrite: false } })
}

async function processEmeraldLinks(outputFolder, templateFolder, projectConfig, firstRun) {
  let emeraldLinks = [null]
  let processedLinks = 0
  if (emeraldLinks.length > 0) {
    emeraldLinks = await findFilesByExtension(outputFolder, '.emerald-link')
    //console.log({outputFolder, emeraldLinks})
    processedLinks += emeraldLinks.length
    if (emeraldLinks.length > 0) {
      console.log(`Processing ${firstRun ? 'the' : 'additional'} .emerald-link link files`)
      for (const emeraldLink of emeraldLinks) {
        try {
          await processEmeraldLink(emeraldLink, outputFolder, templateFolder)
        } catch (error) {
          //console.log('AAAA ', emeraldLink, outputFolder, templateFolder)
          throw error
        }
      }
    }
  }
  return processedLinks
}

module.exports = processEmeraldLinks
