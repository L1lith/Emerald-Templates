const { join, basename } = require('path')
const titleCase = require('./titleCase')
const setDefaultValue = require('./setDefaultValue')

const defaultOptions = {
  name: 'Untitled Project'
}

const dashesRegex = /[\-]+/g

async function getEmeraldConfig(targetFolder) {
  let output = {}
  setDefaultValue(output, 'defaultOptions', true) // If this object is not overwritten we know it's the default options so we assign this property as a signature
  let package = null
  try {
    package = require(join(targetFolder, 'package.json'))
  } catch (error) {
    // Do nothing
  }
  try {
    const result = require(join(targetFolder, 'emerald-config.js'))
    if (typeof output != 'object' || output === null)
      throw new Error('Emerald Config must export an object')
    output = result
  } catch (err1) {
    if (!(err1 instanceof Error) || !err1.message.toLowerCase().includes('cannot find module'))
      throw err1
    try {
      const result = require(join(targetFolder, 'emerald-config.json'))
      if (typeof output != 'object' || output === null)
        throw new Error('Emerald Config must export an object')
      output = result
    } catch (err2) {
      if (!(err2 instanceof Error) || !err2.message.includes('Cannot find module')) throw err2
      // Do Nothing
    }
  }
  if (!output.hasOwnProperty('name')) {
    // Assure it has a name
    if (package && package.hasOwnProperty('name')) {
      output.name = titleCase(package.name.split(dashesRegex).join(' ').trim())
    } else {
      output.name = titleCase(basename(targetFolder).split(dashesRegex).join(' ').trim())
    }
  }
  //output = {...defaultOptions, ...output} // Merge the default options with whatever we find
  Object.entries(defaultOptions).forEach(([key, value]) => {
    if (!output.hasOwnProperty(key)) {
      setDefaultValue(output, key, value)
    }
  })
  return output
}

module.exports = getEmeraldConfig
