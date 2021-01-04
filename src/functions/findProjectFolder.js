const { basename } = require('path')
const chalk = require('chalk')
const getConfiguration = require('./getConfiguration')
const getEmeraldConfig = require('../functions/getEmeraldConfig')

const whitespaceRegex = /\s+/g
const whitespaceOrDashRegex = /[\s\-]+/g

async function findProjectFolder(name) {
  if (typeof name != 'string' || name.length < 1)
    throw new Error('Template name is not a non-empty string')
  name = name.toLowerCase().replace(whitespaceRegex, '-')
  const config = getConfiguration()
  const { projectFolders } = config
  if (projectFolders.length < 1)
    console.warn(chalk.red('Warning: Found no template folders, try setting some up first'))
  for (const projectFolder of projectFolders) {
    const projectName = basename(projectFolder).toLowerCase().replace(whitespaceRegex, '-')
    if (projectName === name) return projectFolder
  }
  const projectMap = {}
  await Promise.all(
    projectFolders.sort().map(async projectPath => {
      const projectConfig = await getEmeraldConfig(projectPath)
      projectMap[projectConfig.name.replace(whitespaceOrDashRegex, '').toLowerCase()] = projectPath
    })
  )
  return projectMap[name.replace(whitespaceOrDashRegex, '').toLowerCase()] || null
}

module.exports = findProjectFolder
