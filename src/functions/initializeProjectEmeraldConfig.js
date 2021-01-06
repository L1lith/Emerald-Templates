const { exists } = require('fs-extra')
const { join } = require('path')

async function initializeProjectEmeraldConfig(path) {
  const emeraldConfigPath = join(path, '.emerald-config')
}

export default initializeProjectEmeraldConfig
