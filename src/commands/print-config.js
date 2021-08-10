const { inspect } = require('util')
const loadGlobalConfig = require('../functions/loadGlobalConfig')

async function printConfig() {
  console.log(inspect(await loadGlobalConfig()))
}

module.exports = { handler: printConfig, description: 'Prints the global emerald-templates config' }
