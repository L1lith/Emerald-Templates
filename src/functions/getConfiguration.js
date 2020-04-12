let result = null

function getConfiguration() {
  if (!result) {
    try {
      result = require('../../emerald-config.json')
    } catch (error) {
      const emeraldError = new Error('Emerald Templates has not been configured, please run "emerald-templates -c"')
      result = emeraldError
    }
  }
  if (result instanceof Error) throw result
  if (!result.hasOwnProperty('templateFolders')) {
    result.templateFolders = []
  } else if (!Array.isArray(result.templateFolders) || result.templateFolders.some(value => typeof value != 'string' || value.length < 1)) {
    throw new Error("Template folders is not an array of non-empty path strings")
  }
  return result
}

module.exports = getConfiguration
