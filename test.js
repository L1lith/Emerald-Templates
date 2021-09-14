const { join } = require('path')
const findProjectRoot = require('./src/functions/findProjectRoot')

const dir = join(__dirname, '../Command-Functions/node_modules')

async function run() {
  console.log(await findProjectRoot(dir))
}

run().catch(console.error)
