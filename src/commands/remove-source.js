const { exists, writeJSON } = require('fs-extra')
const askQuestion = require('../functions/askQuestion')
const getEmeraldConfig = require('../functions/getEmeraldConfig')
const resolvePath = require('../functions/resolvePath')
const saveEmeraldConfig = require('../functions/saveEmeraldConfig')
const findTemplateFolder = require('../functions/findTemplateFolder')

async function removeSource(options) {
  const dir = process.cwd()
  let projectPath = options['project'][0] || process.cwd()
  if (typeof projectPath !== 'string') throw new Error('The project path is not a string')
  projectPath = resolvePath(projectPath.trim(), dir)
  if (!(await exists(projectPath))) throw new Error('Project path does not exist')

  let sourceName =
    (options['source'] || options._ || [])[0] ||
    askQuestion('What is the name of the template source')
  if (typeof sourceName !== 'string') throw new Error('The source template name is not a string')

  const templateDirectory = findTemplateFolder(sourceName)
  if (!templateDirectory) console.warn('WARNING: Could not find an installed template by that name')
  //sourceName = resolvePath(sourceName.trim(), dir)
  //if (!(await exists(sourceName))) throw new Error('Source path does not exist')

  const projectConfig = await getEmeraldConfig(projectPath)
  const sources = projectConfig.source || []
  if (!sources.includes(sourceName)) return console.warn('You have not added this source')
  projectConfig.sources = projectConfig.sources.filter(source => source !== sourceName)

  await saveEmeraldConfig(join(projectPath, 'emerald-config.json'), projectConfig)
}

module.exports = removeSource
