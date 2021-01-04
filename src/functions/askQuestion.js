const readline = require('readline')

function askQuestion(question, options = {}) {
  const { validAnswers = null, trimAnswer = true } = options
  if (
    validAnswers !== null &&
    (!Array.isArray(validAnswers) ||
      validAnswers.length < 1 ||
      validAnswers.some(value => typeof value != 'string'))
  )
    throw new Error('Valid answers must be an array of at least 1 string')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return new Promise((resolve, reject) => {
    if (typeof question != 'string' || question.length < 1)
      reject(new Error('Must supply a question'))
    rl.question(question, answer => {
      // TODO: Log the answer in a database
      if (trimAnswer === true) answer = answer.trim()
      if (validAnswers !== null && !validAnswers.includes(answer))
        return reject(
          new Error('Invalid Answer, expected one of the following: ' + validAnswers.join(', '))
        )
      resolve(answer)
      rl.close()
    })
  })
}

module.exports = askQuestion
