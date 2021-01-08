const { join, basename, exists } = require('path')
const { writeJSON } = require('fs-extra')

async function saveEmeraldConfig(configPath, config) {
  if (typeof config != 'object' || config === null) throw new Error('Config must be an object')
  if (typeof configPath != 'string' || configPath.length < 1)
    throw new Error('Config path must be a non-empty string')
  if (!(await exists(configPath))) {
    if (basename(configPath) !== 'emerald-config.json') {
      configPath = join(configPath, 'emerald-config.json')
      if (await exists(configPath)) {
        // Do Nothing
      } else {
        throw new Error('Invalid Config Path')
      }
    } else {
      throw new Error('Invalid Config Path')
    }
  }
  await writeJSON(configPath, config)
}

module.exports = saveEmeraldConfig
