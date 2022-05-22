const chai = require('chai')
const { expect } = chai
const { details } = require('sandhands')
const { inspect } = require('util')
const { templateDirectory } = require('../../src/commands')

const functions = [
  'addRoot',
  'addProject',
  'addSource',
  'addTemplate',
  'configure',
  'createProject',
  'describeTemplate',
  'generateGem',
  'listGems',
  'listProjects',
  'listRoots',
  'listTemplates',
  'openProject',
  'openTemplate',
  'printConfig',
  'removeProject',
  'removeRoot',
  'removeTemplate',
  'resetConfig',
  'templateDirectory',
  'version',
  'help',
  'Options'
]

const exportsFormat = {
  symbols: Object
}
functions.forEach(functionName => (exportsFormat[functionName] = Function))

describe('the library has the correct exports', () => {
  let lib
  it('can load the library via require', () => {
    lib = require('../../src')
  })
  it('loads the correct exports', async () => {
    expect(inspect(details(lib, exportsFormat))).to.equal('null')
  })
})
