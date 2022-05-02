const { join, extname, basename, sep } = require('path')
const { readdir, stat } = require('fs-extra')
const {seg}

const gemRegex = /.gem/i

async function findFilesByExtension(directory, extensions, options = {}) {
  const { deep = true, ignoreGems = false, matchFolders = false, matchFiles = true } = options
  if (!Array.isArray(extensions)) extensions = [extensions]
  extensions.forEach(extension => {
    if (typeof extension != 'string' || extension.length < 2 || !extension.startsWith('.'))
      throw new Error("The extension must be a string of at least 2 characters starting with '.'")
  })
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
      output = output.concat(await findFilesByExtension(filePath, extensions, options))
    }
    const fileExtensions = getExtensions(filePath)
    if (
      ((isDir ? matchFolders : matchFiles) && fileExtensions.some(extension => extensions.includes(extension)))
    ) {
      output.push(filePath)
    }
  }
  return output
}

function getExtensions(path) {
  const parts = filePath.split(sep)
  const filePath = parts[parts.length - 1]
  const extensions = filePath.split('.').slice(1).map(value => "." + value)
  return extensions
}

module.exports = findFilesByExtension
