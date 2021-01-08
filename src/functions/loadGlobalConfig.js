const { join } = require('path')

const configPath = join(__dirname, '..', '..', 'emerald-global-config.json')

let config = null
let hasCached = false

function loadGlobalConfig(options = {}) {
  const { fresh = true, catchErrors = false } = options
  if (!fresh && hasCached) return config
  try {
    config = require(configPath)
    hasCached = true
    return config
  } catch (error) {
    if (catchErrors) {
      console.warn('Could not load the global config due to the following error:')
      console.error(error)
      return null
    } else {
      throw error
    }
  }
}

module.exports = loadGlobalConfig
