const { accessSync, constants } = require('fs')

function exists(filepath) {
  let flag = true
  try {
    accessSync(filepath, constants.F_OK)
  } catch (e) {
    flag = false
  }
  return flag
}

module.exports = exists
