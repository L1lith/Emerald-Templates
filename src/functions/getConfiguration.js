let result = null

function getConfiguration() {
  if (result) {
    if (result instanceof Error) {
      throw result
    } else {
      return result
    }
  }
  try {
    result = require('../../emerald-config.json')
    return result
  } catch (error) {
    const emeraldError = new Error('Emerald Templates has not been configured, please run "emerald-templates -c"')
    result = emeraldError
    throw emeraldError
  }
}

module.exports = getConfiguration
