const {promisify} = require('util')
const deglob = promisify(require('deglob'))
const {join, dirname, relative} = require('path')
const {readFile} = require('fs-extra')
const mkdirp = require('mkdirp')
const mvdir = require('mvdir')
const {isFile, isDirectory} = require('path-type')
const walk = require('ignore-walk')

async function copyTemplate(templateFolder, outputFolder) {
  await mkdirp(outputFolder)
  const files = await walk({
    path: templateFolder,
    ignoreFiles: [".emignore"],
    follow: false
  })
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const sourcePath = join(templateFolder, file)
    const outputPath = join(outputFolder, file)
    await mkdirp(dirname(outputPath))
    console.log()
    await mvdir(sourcePath, outputPath, { copy: true })
  }
}

// async function copy(source, output, options={}) {
//   const {ignoreRules=[], deep=true} = options
//   const sourceType = (await isFile(source)) ? 'file' : (await isDirectory(source) ? 'directory': 'other')
//   //if (sourceType === 'other') return // Don't copy symlinks or other things like that
//   if (sourceType === "directory") {
//     try {
//       const foundIgnoreRules = (await readFile(join(source, '.emignore'), 'utf8')).split('\n').map(line => line.trim()).filter(line => line.length > 0)
//       const newIgnoreRules = [...ignoreRules]
//       foundIgnoreRules.forEach(rule => {
//         if (!newIgnoreRules.includes(rule)) newIgnoreRules.push(rule)
//       })
//       options.ignoreRules = ignoreRules = newIgnoreRules
//     } catch(error) {
//       console.log(error)
//     }
//     await mkdirp(output)
//     if (deep === true) {
//
//     }
//   } else if (sourceType === "file") {
//
//   } else {
//     // Do Nothing
//   }
//   for (let i = 0; i < files.length; i++) {
//     const file = files[i]
//     await mkdirp(dirname(file))
//     const relativePath = relative(templateFolder, file)
//     const outputPath = join(outputFolder, relativePath)
//     await mvdir(file, outputPath, { copy: true })
//   }
// }

module.exports = copyTemplate
