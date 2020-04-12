const {sanitize} = require('sandhands')
const args = require('yargs').argv

function ensureArguments(argumentObject) {
  if (typeof argumentObject != 'object' || argumentObject === null) throw new Error("Argument object is not an object")
  Object.entries(argumentObject).forEach(([key, value]) => {
    try {
      const input = args[key]
      let format = value
      try {
        format = eval(format)
      } catch(error) {/*do nothing*/}
      sanitize(input, format)
    } catch(error) {
      error.message = `The following error occured while validating the "${key}" argument for a .emerald-script: ${error.message}`
      throw error
    }
  })
}

module.exports = ensureArguments
