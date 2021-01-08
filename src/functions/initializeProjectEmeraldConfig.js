const { exists } = require('fs-extra')
const { join } = require('path')

// NOTE THIS FILE IS DEPRECATED
async function initializeProjectEmeraldConfig(path) {
  const emeraldConfigPath = join(path, 'emerald-config')
}

export default initializeProjectEmeraldConfig
