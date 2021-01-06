const { join } = require('path')
const { writeFileSync } = require('fs')

const configPath = join(__dirname, '..', '..', 'emerald-global-config.json')

function saveGlobalConfig(configObject) {
  if (typeof configObject != 'object' || configObject === null)
    throw new Error('Must supply a valid config object')
  writeFileSync(configPath, JSON.stringify(configObject))
}

module.exports = saveGlobalConfig
