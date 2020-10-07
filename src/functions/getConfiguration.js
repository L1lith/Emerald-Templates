let result = null

function getConfiguration(ensureConfigured=false) {
  if (!result) {
    try {
      result = require('../../emerald-global-config.json')
    } catch (error) {
      if (ensureConfigured === true) {
        throw new Error(`Emerald Templates has not been configured, please run "${process.argv[0] === "emerald-templates" ? "emerald-templates" : "emt"} configure"`)
      } else {
        result = {}
      }
    }
  }
  if (!result.hasOwnProperty('templateFolders')) {
    result.templateFolders = []
  } else if (!Array.isArray(result.templateFolders) || result.templateFolders.some(value => typeof value != 'string' || value.length < 1)) {
    throw new Error("Template folders is not an array of non-empty path strings")
  }
  if (!result.hasOwnProperty('rootFolders')) {
    result.rootFolders = []
  } else if (!Array.isArray(result.rootFolders) || result.rootFolders.some(value => typeof value != 'string' || value.length < 1)) {
    throw new Error("Root folders is not an array of non-empty path strings")
  }
  return result
}

module.exports = getConfiguration
