const { readdir } = require('fs-extra')

async function getSubdirectories(source) {
  return (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
}

module.exports = getSubdirectories
