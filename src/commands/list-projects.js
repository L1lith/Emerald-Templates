const chalk = require('chalk')
const getConfiguration = require('../functions/getConfiguration')
const getEmeraldConfig = require('../functions/getEmeraldConfig')
const displayList = require('../functions/displayList')

async function listProjects() {
  const { projectFolders } = getConfiguration()
  if (projectFolders.length < 1) {
    throw new Error('There are no saved project folders')
  }
  const projectList = await Promise.all(
    projectFolders.sort().map(async projectPath => {
      const projectConfig = await getEmeraldConfig(projectPath)
      return chalk.cyan(projectConfig.name + ': "' + projectPath + '"')
    })
  )
  displayList(projectList, 'Project Folders')
  //console.log(` Configured for the following root folders:\n${).join('\n')}`)
}

module.exports = listProjects
