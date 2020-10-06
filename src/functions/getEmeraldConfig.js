const {join} = require('path')

const defaultOptions = {
  name: "Untitled Project"
}

async function getEmeraldConfig(templateFolder) {
  let output = {defaultObject: true} // If this object is not overwritten we know it's the default options so we assign this property as a signature
  let package = null
  try {
    package = require(join(templateFolder, 'package.json'))
  } catch(error) {
    // Do nothing
  }
  try {
    const result = require(join(templateFolder, '.emerald-config.js'))
    if (typeof output != 'object' || output === null) throw new Error("Emerald Config must export an object")
    output = result
  } catch(err1) {
    if (!(err1 instanceof Error) || !err1.message.toLowerCase().includes('cannot find module')) throw err1
    try {
      const result = require(join(templateFolder, '.emerald-config.json'))
      if (typeof output != 'object' || output === null) throw new Error("Emerald Config must export an object")
      output = result
    } catch(err2) {
      if (!(err2 instanceof Error) || !err2.message.includes('Cannot find module')) throw err2
      // Do Nothing
    }
  }
  output = {...defaultOptions, name: (package || {}).name || defaultOptions.name, ...output} // Merge the default options with whatever we find
  return output
}

module.exports = getEmeraldConfig
