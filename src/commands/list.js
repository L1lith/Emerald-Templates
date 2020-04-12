const getConfiguration = require('../functions/getConfiguration')
const directoryExists = require('directory-exists')
const getChildDirectories = require('../functions/getChildDirectories')

const excludedDirectoryNames = ['.git']

async function list() {
  const {templateFolders} = getConfiguration()
  if (!(await directoryExists(templateFolder))) throw new Error("The folder configured to contain the templates does not exist")
  let childDirectories = await getChildDirectories(templateFolder)
  childDirectories = childDirectories.filter(name => !excludedDirectoryNames.includes(name))
  console.log(" Available Templates:\n- " + childDirectories.join(', '))
}

module.exports = list
