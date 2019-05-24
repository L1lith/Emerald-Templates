const getConfiguration = require('../functions/getConfiguration')

function generate(options) {
  const config = getConfiguration()
  const template = args._[0]
  console.log(template)
}

module.exports = generate
