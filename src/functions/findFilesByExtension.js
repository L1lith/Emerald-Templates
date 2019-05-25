const {join, extname} = require('path')
const {readdir, stat} = require('fs-extra')

async function findFilesByExtension(directory, extension) {
  if (typeof extension != 'string' || extension.length < 1 || !extension.startsWith('.')) throw new Error("The extension must be a string of at least 2 characters starting with '.'")
  const files = await readdir(directory)
  let output = []

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i]
    const filePath = join(directory, fileName)
    if ((await stat(filePath)).isDirectory()) {
      result = result.concat(findFilesByExtension(filePath, extension))
    } else {
      if (extname(filePath) === extension) {
        output.push(filePath)
      }
    }
  }
  return output
}

module.exports = findFilesByExtension
