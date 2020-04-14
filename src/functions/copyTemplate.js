const {promisify} = require('util')
const deglob = promisify(require('deglob'))
const {join, dirname, relative} = require('path')
const {readFile} = require('fs-extra')
const mkdirp = require('mkdirp')
const mvdir = require('mvdir')
const {isFile, isDirectory} = require('path-type')
const walk = require('ignore-walk')

async function copyTemplate(templateFolder, outputFolder, options={}) {
  const {overwrite=false}
  await mkdirp(outputFolder)
  const files = await walk({
    path: templateFolder,
    ignoreFiles: [".emignore"],
    follow: false
  })
  for (const file of files) {
    if (file === "node_modules" || file === ".git") continue
    const sourcePath = join(templateFolder, file)
    const outputPath = join(outputFolder, file)
    await mkdirp(dirname(outputPath))
    await mvdir(sourcePath, outputPath, { copy: true, overwrite })
  }
}

module.exports = copyTemplate
