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
  if (typeof result.templateFolder != 'string' || result.templateFolder.length < 1) throw new Error("Missing the Template Folder from the config")
  return result
}

module.exports = getConfiguration
