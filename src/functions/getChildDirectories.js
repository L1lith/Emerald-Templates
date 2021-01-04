const { readdir } = require('fs')

function getChildDirectories(source) {
  return new Promise((resolve, reject) => {
    readdir(source, { withFileTypes: true }, (err, directories) => {
      if (err) return reject(err)
      resolve(directories.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name))
    })
  })
}

module.exports = getChildDirectories
