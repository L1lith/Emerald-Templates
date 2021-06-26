const findFilesByExtension = require('./src/functions/findFilesByExtension')
const getAvailableGems = require('./src/functions/getAvailableGems')
const { join } = require('path')

const dir = join(__dirname, '../fly-install/')

async function run() {
  console.log(await getAvailableGems(dir))
}

run().catch(console.error)
