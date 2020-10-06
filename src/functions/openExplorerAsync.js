const openExplorer = require('open-file-explorer')

function openExplorerAsync(path) {
  return new Promise((resolve, reject) => {
    openExplorer(path, err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

module.exports = openExplorerAsync
