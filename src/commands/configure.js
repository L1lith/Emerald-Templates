const askQuestion = require('../functions/askQuestion')
const resolvePath = require('../functions/resolvePath')
const {writeFileSync} = require('fs')
const {join} = require('path')

const configPath = join(__dirname, '..', '..', 'emerald-config.json')

async function configure(options) {
  const templateFolder = resolvePath(await askQuestion("Please enter the path to your templates folder\n> "), process.cwd())
  console.log(`Setting the templates folder path as "${templateFolder}"`)
  const config = {templateFolder}
  writeFileSync(configPath, JSON.stringify(config))
  console.log("Config saved.")
}

module.exports = configure
