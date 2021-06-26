const { join, extname, basename } = require('path')
const { readdir, stat } = require('fs-extra')

const gemRegex = /.gem/i

async function findFilesByExtension(directory, extension, options = {}) {
  if (typeof extension != 'string' || extension.length < 1 || !extension.startsWith('.'))
    throw new Error("The extension must be a string of at least 2 characters starting with '.'")
  const { deep = true, ignoreGems = false, matchFolders = false, matchFiles = true } = options
  const files = await readdir(directory)
  let output = []

  for (const fileName of files) {
    const filePath = join(directory, fileName)
    const isDir = (await stat(filePath)).isDirectory()
    if (isDir) {
      if (
        deep !== true ||
        fileName === 'node_modules' ||
        (ignoreGems === true && gemRegex.test(fileName))
      )
        continue // Don't look for templates in the node modules
      output = output.concat(await findFilesByExtension(filePath, extension))
    }
    if (
      ((isDir ? matchFolders : matchFiles) && extname(fileName) === extension) ||
      basename(fileName) === extension
    ) {
      output.push(filePath)
    }
  }
  return output
}

module.exports = findFilesByExtension
