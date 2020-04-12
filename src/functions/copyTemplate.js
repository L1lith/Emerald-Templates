const {promisify} = require('util')
const deglob = promisify(require('deglob'))
const {join, dirname, relative} = require('path')
const {copy} = require('fs-extra')
const mkdirp = require('mkdirp')
const clone = require('@wrote/clone')

async function copyTemplate(templateFolder, outputFolder) {
  const options = {
    cwd: templateFolder,
    ignore: ['/node_modules/'],
    useGitIgnore: true,
    usePackageJson: false,
    gitIgnoreFile: '.emignore'
  }
  const files = await deglob(['*'], options)
  console.log(files, options)
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    await mkdirp(dirname(file))
    const relativePath = relative(templateFolder, file)
    const outputPath = join(outputFolder, relativePath)
    await clone(file, outputPath)
  }
}

module.exports = copyTemplate
