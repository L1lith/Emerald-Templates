const readline = require('readline')

function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return new Promise((resolve, reject) => {
    if (typeof question != 'string' || question.length < 1) reject(new Error("Must supply a question"))
    rl.question(question, answer => {
      // TODO: Log the answer in a database
      resolve(answer)
      rl.close()
    })
  })
}

module.exports = askQuestion
