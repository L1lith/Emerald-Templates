const notFoundError = 'MODULE_NOT_FOUND'

function tryRequire(...args) {
  try {
    return require(...args)
  } catch (error) {
    if (error?.code !== notFoundError) console.error(error)
    return null
  }
}

module.exports = tryRequire
