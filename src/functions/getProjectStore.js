const getEmeraldConfig = require('./getEmeraldConfig')
const { Jabr, syncToJSON } = require('jabr')
const resolvePath = require('../functions/resolvePath')

function getProjectStore(projectPath, projectConfig = null) {
  if (typeof projectPath != 'string') throw new Error('Invalid Project Path')
  if (projectConfig === null) projectConfig = getEmeraldConfig(projectPath)
  if ('store' in projectConfig) {
    let storePath
    let args = []
    if (Array.isArray(projectConfig.store)) {
      // received a set of jabr arguments as well
      if (projectConfig.store.length < 1)
        throw new Error('Received empty store projectConfig array')
      storePath = projectConfig.store[0]
      args = projectConfig.store.slice(1)
    } else if (typeof projectConfig.store == 'string') {
      storePath = projectConfig.store
    } else {
      throw new Error('received invalid store projectConfig value')
    }
    storePath = resolvePath(storePath, projectPath) // Make it relative to the supplied project directory

    const store = new Jabr(...args)
    syncToJSON(store, storePath)
    return store
  } else {
    return null
  }
}

module.exports = getProjectStore
