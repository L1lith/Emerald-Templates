const { exists } = require('fs-extra')
const askQuestion = require('../functions/askQuestion')
const getEmeraldConfig = require('../functions/getEmeraldConfig')
const resolvePath = require('../functions/resolvePath')

async function addSource(options) {
  const dir = process.cwd()
  let projectPath = options['project'][0] || process.cwd()
  if (typeof projectPath !== 'string') throw new Error('The project path is not a string')
  projectPath = resolvePath(projectPath.trim(), dir)
  if (!(await exists(projectPath))) throw new Error('Project path does not exist')

  let sourcePath =
    options['source'][0] || askQuestion('What is the path to the new source directory')
  if (typeof sourcePath !== 'string') throw new Error('The source path is not a string')
  sourcePath = resolvePath(sourcePath.trim(), dir)
  if (!(await exists(sourcePath))) throw new Error('Source path does not exist')

  const projectConfig = await getEmeraldConfig(projectPath)
  const sources = projectConfig.source || []
  if (sources.includes(sourcePath)) return console.warn('You have already added this source')
  projectConfig.sources.push(sourcePath)
}

module.exports = addSource
