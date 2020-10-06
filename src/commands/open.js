const findTemplateFolder = require('../functions/findTemplateFolder')
const openExplorer = require('../functions/openExplorerAsync')

async function describe(options) {
  let targetTemplate = (options['--targetFolder'] || options._[0] || "").trim()
  if (typeof targetTemplate != 'string' || targetTemplate.length < 1) throw new Error("Must specify a valid template name")
  const templateFolder = await findTemplateFolder(targetTemplate)
  if (!templateFolder) throw new Error("Could not find the specified template")
  await openExplorer(templateFolder)
}

module.exports = describe
