const addRoot = require('./add-root')
const addProject = require('./add-project')
const addSource = require('./add-source')
const addTemplate = require('./add-template')
const configure = require('./configure')
const createProject = require('./create-project')
const describeTemplate = require('./describe-template')
const generateGem = require('./generate-gem')
const listGems = require('./list-gems')
const listProjects = require('./list-projects')
const listRoots = require('./list-roots')
const listTemplates = require('./list-templates')
const openProject = require('./open-project')
const openTemplate = require('./open-template')
const printConfig = require('./print-config')
const removeProject = require('./remove-project')
const removeRoot = require('./remove-root')
const removeTemplate = require('./remove-template')
const resetConfig = require('./reset-config')
const templateDirectory = require('./template-directory')
const version = require('./version')
const installTemplate = require('./install-template')
const updateTemplate = require('./update-template')

module.exports = {
  addRoot,
  addProject,
  addSource,
  addTemplate,
  configure,
  createProject,
  describeTemplate,
  generateGem,
  installTemplate,
  listGems,
  listProjects,
  listRoots,
  listTemplates,
  openProject,
  openTemplate,
  printConfig,
  removeProject,
  removeRoot,
  removeTemplate,
  resetConfig,
  templateDirectory,
  updateTemplate,
  version
}
