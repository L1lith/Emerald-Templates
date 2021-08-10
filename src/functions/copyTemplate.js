const { promisify } = require('util')
const deglob = promisify(require('deglob'))
const { join, dirname, relative } = require('path')
const { readFile, exists } = require('fs-extra')
const mkdirp = require('mkdirp')
const mvdir = require('mvdir')
const { isFile, isDirectory } = require('path-type')
const walk = require('ignore-walk')
const containsPath = require('contains-path')
const gemRegex = /\.gem/i

async function copyTemplate(templateFolder, outputFolder, options = {}) {
  const { overwrite = false, allowGems = false } = options
  await mkdirp(outputFolder)
  let files = await walk({
    path: templateFolder,
    ignoreFiles: ['.emignore'],
    follow: false
    //filters: ['node_modules', 'gems'] // I don't think this is a real option
  })
  files = files.filter(
    file =>
      !(
        containsPath(file, 'node_modules') ||
        containsPath(file, '.git') ||
        file.includes('emerald-config.js') ||
        file.includes('emerald-config.json')
      )
  )
  if (allowGems === false) files = files.filter(file => !gemRegex.test(file)) // Don't include gems by default
  for (const file of files) {
    const sourcePath = join(templateFolder, file)
    const outputPath = join(outputFolder, file)
    if (!overwrite) {
      if (await exists(outputPath)) {
        continue // Prevent Overwriting Files
      } else {
        let finalPath = outputPath
        while (finalPath.endsWith('.emerald')) {
          finalPath = finalPath.split('.').slice(0, -1).join('.')
        }
        if (finalPath !== outputPath && (await exists(finalPath))) {
          continue // Prevent Overwriting with .emerald files
        }
      }
    }
    await mkdirp(dirname(outputPath))
    await mvdir(sourcePath, outputPath, { copy: true, overwrite })
  }
}

module.exports = copyTemplate
