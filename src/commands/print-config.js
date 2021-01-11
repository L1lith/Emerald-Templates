const { inspect } = require('util')
const loadGlobalConfig = require('../functions/loadGlobalConfig')

async function printConfig() {
  console.log(inspect(await loadGlobalConfig()))
}

module.exports = printConfig
