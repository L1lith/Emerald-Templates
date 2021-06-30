const leadingPathing = /(^[\s\W]+|$[\s\W]+)/g
const pathingRegex = /[\s\W]+/g

function pathCase(str) {
  return str.toLowerCase().replace(leadingPathing, '').replace(pathingRegex, '-')
}

module.exports = pathCase
