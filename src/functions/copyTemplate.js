const {promisify} = require('util')
const deglob = promisify(require('deglob'))
const {join, dirname, relative} = require('path')
const {copy} = require('fs-extra')
const mkdirp = require('mkdirp')
const mvdir = require('mvdir')

async function copyTemplate(templateFolder, outputFolder) {
  const options = {
    cwd: templateFolder,
    ignore: ['/node_modules/'],
    useGitIgnore: true,
    usePackageJson: false,
    gitIgnoreFile: '.emignore'
  }
  const files = await deglob(['*'], options)
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    await mkdirp(dirname(file))
    const relativePath = relative(templateFolder, file)
    const outputPath = join(outputFolder, relativePath)
    console.log(file, outputPath)
    await mvdir(file, outputPath, { copy: true })
  }
}

module.exports = copyTemplate
