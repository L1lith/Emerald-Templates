const { sanitize } = require('sandhands')

function ensureArguments(argumentObject, sanitizeArguments) {
  if (typeof argumentObject != 'object' || argumentObject === null)
    throw new Error('Argument object is not an object')
  Object.entries(sanitizeArguments).forEach(([key, value]) => {
    try {
      const input = sanitizeArguments[key]
      let format = value
      try {
        format = eval(format)
      } catch (error) {
        /*do nothing*/
      }
      sanitize(input, format)
    } catch (error) {
      error.message = `The following error occurred while validating the "${key}" argument for a .emerald-script: ${error.message}`
      throw error
    }
  })
}

module.exports = ensureArguments
