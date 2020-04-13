const getConfiguration = require('../functions/getConfiguration')
const getTemplateFolders = require('../functions/getTemplateFolders')
const {basename} = require('path')

const excludedDirectoryNames = ['.git']

async function list() {
  const templateFolders = await getTemplateFolders()
  console.log(" Available Templates:\n- " + templateFolders.map(path => basename(path)).sort().join(', '))
}

module.exports = list
