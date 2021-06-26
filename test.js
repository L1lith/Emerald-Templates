const findFilesByExtension = require('./src/functions/findFilesByExtension')
const getAvailableGems = require('./src/functions/getAvailableGems')
const { join } = require('path')

async function run() {
  console.log(await getAvailableGems(join(__dirname, '..')))
}

run().catch(console.error)
