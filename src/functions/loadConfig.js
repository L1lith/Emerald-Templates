const {join} = require('path')

const configPath = join(__dirname, '..', '..', 'emerald-global-config.json')

function loadConfig() {
  let config = {}
  try {
    config = require(configPath)
  } catch(error) {}
  return config
}

module.exports = loadConfig
