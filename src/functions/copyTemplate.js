const {promisify} = require('util')
const deglob = promisify(require('deglob'))
const {join, dirname, relative} = require('path')
const {copy, readFile} = require('fs-extra')
const mkdirp = require('mkdirp')
const mvdir = require('mvdir')

async function copyTemplate(templateFolder, outputFolder) {
  const ignores = (await readFile(join(templateFolder, '.emignore'), 'utf8')).split('\n').map(line => line.trim()).filter(line => line.length > 0)
  const options = {
    cwd: templateFolder,
    ignore: ['/node_modules/', ...ignores],
    //useGitIgnore: true,
    usePackageJson: false,
    gitIgnoreFile: '.emignore'
  }
  const files = await deglob(['*'], options)
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    await mkdirp(dirname(file))
    const relativePath = relative(templateFolder, file)
    const outputPath = join(outputFolder, relativePath)
    await mvdir(file, outputPath, { copy: true })
  }
}

module.exports = copyTemplate
