const setDefaultValue = require('./setDefaultValue')

let result = null

const defaultOptions = {
  automaticallyInstallDependencies: true,
  automaticallyInitializeGitRepo: true,
  automaticallySaveProjects: true,
  rootFolders: [],
  templateFolders: [],
  projectFolders: []
}

function getConfiguration(ensureConfigured = false) {
  if (!result) {
    try {
      result = require('../../emerald-global-config.json')
    } catch (error) {
      if (ensureConfigured === true) {
        throw new Error(
          `Emerald Templates has not been configured, please run "${
            process.argv[0] === 'emerald-templates' ? 'emerald-templates' : 'emt'
          } configure"`
        )
      } else {
        result = {}
      }
    }
  }
  if (typeof result.launchCommand == 'string') result.launchCommand = result.launchCommand.trim()
  Object.entries(defaultOptions).forEach(([key, value]) => {
    if (!result.hasOwnProperty(key)) {
      setDefaultValue(result, key, value)
    }
  })
  if (
    ensureConfigured === true &&
    result.templateFolders.length < 1 &&
    result.rootFolders.length < 1
  )
    throw new Error('Must configure at least 1 template or root folder')
  if (
    !Array.isArray(result.templateFolders) ||
    result.templateFolders.some(value => typeof value != 'string' || value.length < 1)
  ) {
    throw new Error('Template folders is not an array of non-empty path strings')
  }
  if (
    !Array.isArray(result.rootFolders) ||
    result.rootFolders.some(value => typeof value != 'string' || value.length < 1)
  ) {
    throw new Error('Root folders is not an array of non-empty path strings')
  }
  return result
}

module.exports = getConfiguration
