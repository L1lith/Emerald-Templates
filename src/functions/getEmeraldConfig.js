const { join, basename } = require('path')
const titleCase = require('./titleCase')
const setDefaultValue = require('./setDefaultValue')
const { writeJson } = require('fs-extra')

const defaultOptions = {}

const dashesRegex = /[\-]+/g
const gemRegex = /.gem$/i

async function getEmeraldConfig(targetFolder, options = {}) {
  const {
    generateDefaultConfig = false,
    defaultConfigOptions = {},
    debug = false,
    defaultOptions
  } = options
  if (typeof generateDefaultConfig != 'boolean')
    throw new Error('second argument must be a boolean')
  let output = defaultConfigOptions
  setDefaultValue(output, 'defaultOptions', true) // If this object is not overwritten we know it's the default options so we assign this property as a signature
  let ourPackage = null
  try {
    ourPackage = require(join(targetFolder, 'package.json'))
  } catch (error) {
    // Do nothing
    if (debug) {
      console.warn('The following error occurred while trying to load the package.json')
      console.error(error)
    }
  }
  try {
    const result = require(join(targetFolder, 'emerald-config.json'))
    if (typeof output != 'object' || output === null)
      throw new Error('Emerald Config must export an object')
    output = result
  } catch (err2) {
    if (debug) {
      console.warn('The following error occurred while trying to load the emerald-config.json')
      console.error(err2)
    }
    if (
      !(err2 instanceof Error) ||
      (!err2.message.includes('Cannot find module') && generateDefaultConfig === false)
    )
      throw err2
    // Do Nothing
  }

  if (!output.hasOwnProperty('name')) {
    // Assure it has a name
    if (ourPackage && ourPackage.hasOwnProperty('name')) {
      output.name = titleCase(ourPackage.name.split(dashesRegex).join(' ').trim())
    } else {
      output.name = titleCase(basename(targetFolder).split(dashesRegex).join(' ').trim())
    }
  }
  while (output.name.endsWith('.gem')) output.name = output.name.replace(gemRegex, '')
  output.pathName = output.name.toLowerCase().trim().replace(/\s+/g, '-')
  //output = {...defaultOptions, ...output} // Merge the default options with whatever we find
  if (typeof defaultOptions == 'object' && defaultOptions !== null) {
    Object.entries(defaultOptions).forEach(([key, value]) => {
      output[key] = value
    })
  }
  if (generateDefaultConfig === true) {
    await writeJson(join(targetFolder, 'emerald-config.json'), output)
  }
  return output
}

module.exports = getEmeraldConfig
