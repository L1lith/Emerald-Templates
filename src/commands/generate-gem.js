const getEmeraldConfig = require('../functions/getEmeraldConfig')
const findGemPath = require('../functions/findGemPath')
const resolvePath = require('../functions/resolvePath')

async function generateGem(options) {
  const dir = process.cwd()
  let gemName =
    options['gem'] || options._[0] || (await askQuestion('Which gem would you like to use?\n> '))
  if (typeof gemName !== 'string') throw new Error('Must supply a valid gem name string')
  gemName = gemName.trim()
  if (gemName.length < 1) throw new Error('The gem name string must not be empty')
  let projectPath = options.hasOwnProperty('project')
    ? resolvePath(options.project, dir)
    : options._.length >= 2
    ? options._[1]
    : dir

  const projectConfig = await getEmeraldConfig(projectPath)
  if (!Array.isArray(projectConfig.sources) || projectConfig.sources.length < 1)
    throw new Error('This project has no template sources. Try running the add-source command.')
  const { sources } = projectConfig
  const gemPath = await findGemPath(sources, gemName)
  if (gemPath === null) throw new Error('Could not find a matching gem')
}

module.exports = generate
