const findTemplateFolder = require('../functions/findTemplateFolder')


async function getDirectory(options) {
  let targetTemplate = (options['--targetFolder'] || options._[0] || "").trim()
  if (typeof targetTemplate != 'string' || targetTemplate.length < 1) throw new Error("Must specify a valid template name")
  const templateFolder = await findTemplateFolder(targetTemplate)
  if (!templateFolder) throw new Error("Could not find the specified template")
  process.stdout.write(templateFolder)
}

module.exports = getDirectory
