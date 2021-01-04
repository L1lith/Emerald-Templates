const { join, extname, basename } = require('path')
const { readdir, stat } = require('fs-extra')

async function findFilesByExtension(directory, extension) {
  if (typeof extension != 'string' || extension.length < 1 || !extension.startsWith('.'))
    throw new Error("The extension must be a string of at least 2 characters starting with '.'")
  const files = await readdir(directory)
  let output = []

  for (const fileName of files) {
    const filePath = join(directory, fileName)
    if ((await stat(filePath)).isDirectory()) {
      if (fileName === 'node_modules') continue // Don't look for templates in the node modules
      output = output.concat(await findFilesByExtension(filePath, extension))
    } else {
      if (extname(filePath) === extension || basename(filePath) === extension) {
        output.push(filePath)
      }
    }
  }
  return output
}

module.exports = findFilesByExtension
