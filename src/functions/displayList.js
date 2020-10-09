const chalk = require('chalk')

function logList(stringList, title=null, outputToConsole=true) {
  if (!Array.isArray(stringList) || stringList.length < 1 || stringList.some(string => typeof string != 'string' || string.length < 1)) throw new Error("Must supply a list of non-empty strings")
  const displayString = `+---- ${title===null ? '' : title + ' ----+'}\n${stringList.map(string => "|=- " + string).join('\n')}\n+----`
  if (outputToConsole === true) {
    console.log(chalk.green(displayString))
    return true
  }
  return displayString
}

module.exports = logList
