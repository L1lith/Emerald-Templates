const chalk = require('chalk')
const getConfiguration = require('../functions/getConfiguration')
const getEmeraldConfig = require('../functions/getEmeraldConfig')
const displayList = require('../functions/displayList')

async function listProjects(options) {
  const { mode } = options
  const { projectFolders } = getConfiguration()
  if (projectFolders.length < 1) {
    throw new Error('There are no saved project folders')
  }
  if (mode === 'cli') {
    const projectList = await Promise.all(
      projectFolders.sort().map(async projectPath => {
        const projectConfig = await getEmeraldConfig(projectPath)
        return chalk.cyan(projectConfig.name + ': "' + projectPath + '"')
      })
    )
    displayList(projectList, 'Project Folders')
  } else {
    const output = {}
    projectFolders.forEach(async projectPath => {
      const projectConfig = await getEmeraldConfig(projectPath)
      output[projectConfig.pathName] = projectConfig
    })
    return output
  }
  //console.log(` Configured for the following root folders:\n${).join('\n')}`)
}

module.exports = {
  handler: listProjects,
  aliases: ['projects']
}
