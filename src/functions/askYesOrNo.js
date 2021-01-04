const askQuestion = require('./askQuestion')

const yesOrNo = ['yes', 'no']
const nonAlphabetical = /[^a-z]*/gi

async function askYesOrNo(question, retry = false) {
  let answer = (await askQuestion(question)).replace(nonAlphabetical, '').toLowerCase()
  if (!yesOrNo.includes(answer)) {
    if (retry === true) {
      while (!yesOrNo.includes(answer))
        answer = (await askQuestion(question)).replace(nonAlphabetical, '').toLowerCase()
    } else {
      throw new Error('Must answer yes or no')
    }
  }
  return answer === 'yes'
}

module.exports = askYesOrNo
