const chalk = require('chalk')

const listStyles = ['lines', 'numeric']

function displayList(stringList, title = null, options = {}) {
  const { outputToConsole = true, listStyle = 'lines' } = options
  if (!listStyles.includes(listStyle)) throw new Error('Invalid List Style')
  if (
    !Array.isArray(stringList) ||
    stringList.some(string => typeof string != 'string' || string.length < 1)
  )
    throw new Error('Must supply a list of non-empty strings or an empty list')
  let displayString = chalk.green(`+---- ${title === null ? '' : title + ' ----+'}\n`)
  if (stringList.length > 0) {
    displayString += chalk.green(
      stringList
        .map(
          (string, i) =>
            '|' + (listStyle === 'lines' ? '=- ' : ' ' + (i + 1) + '. ') + chalk.cyan(string)
        )
        .join('\n') + '\n+----'
    )
  } else {
    displayString += chalk.cyan('(none)')
  }
  if (outputToConsole === true) {
    console.log(chalk.green(displayString))
    return true
  }
  return displayString
}

module.exports = displayList
