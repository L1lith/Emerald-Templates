const chalk = require('chalk')

const listStyles = ['lines', 'numeric']

function displayList(stringList, title = null, options = {}) {
  const { outputToConsole = true, listStyle = 'lines' } = options
  if (!listStyles.includes(listStyle)) throw new Error('Invalid List Style')
  if (
    !Array.isArray(stringList) ||
    stringList.length < 1 ||
    stringList.some(string => typeof string != 'string' || string.length < 1)
  )
    throw new Error('Must supply a list of non-empty strings')
  const displayString = `+---- ${title === null ? '' : title + ' ----+'}\n${stringList
    .map((string, i) => '|' + (listStyle === 'lines' ? '=- ' : ' ' + (i + 1) + '. ') + string)
    .join('\n')}\n+----`
  if (outputToConsole === true) {
    console.log(chalk.green(displayString))
    return true
  }
  return displayString
}

module.exports = displayList
