const { join, basename } = require('path')
const titleCase = require('./titleCase')
const setDefaultValue = require('./setDefaultValue')
const { writeJson } = require('fs-extra')
const tryRequire = require('./tryRequire')
const getPathName = require('./getPathName')
const dashesRegex = /[-]+/g
const gemRegex = /.gem$/i

const validTypes = ['project', 'gem']

async function getEmeraldConfig(targetFolder, options = {}) {
  const {
    generateDefaultConfig = false,
    defaultConfigOptions = {},
    defaultOptions,
    type = 'project'
  } = options
  if (typeof generateDefaultConfig != 'boolean')
    throw new Error('second argument must be a boolean')
  if (!validTypes.includes(type)) throw new Error(`Invalid Project Type "${type}"`)
  let output = defaultConfigOptions
  setDefaultValue(output, 'defaultOptions', true) // If this object is not overwritten we know it's the default options so we assign this property as a signature
  let ourPackage = tryRequire(join(targetFolder, 'package.json'))
  const configPath = join(targetFolder, type === 'project' ? 'emerald-config' : 'gem')

  const rawConfig = tryRequire(configPath + '.js') || tryRequire(configPath + '.json')
  if (typeof rawConfig != 'object') {
    throw new Error('Emerald Config must export an object or null')
  } else if (rawConfig !== null) {
    output = { ...output /* Assign the default options */, ...rawConfig }
  }

  if (!('name' in output)) {
    // Assure it has a name
    if (ourPackage && 'name' in ourPackage) {
      output.name = titleCase(ourPackage.name.split(dashesRegex).join(' ').trim())
    } else {
      output.name = titleCase(basename(targetFolder).split(dashesRegex).join(' ').trim())
    }
  }
  if (type === 'gem')
    while (output.name.endsWith('.gem')) output.name = output.name.replace(gemRegex, '')
  output.pathName = getPathName(output.name)
  output.path = targetFolder
  //output = {...defaultOptions, ...output} // Merge the default options with whatever we find
  if (typeof defaultOptions == 'object' && defaultOptions !== null) {
    Object.entries(defaultOptions).forEach(([key, value]) => {
      output[key] = value
    })
  }
  if (generateDefaultConfig === true) {
    await writeJson(configPath + '.json', output)
  }
  return output
}

module.exports = getEmeraldConfig
