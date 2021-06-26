#!/usr/bin/env node
const args = require('./functions/getArgs')()

const commandFunction = require('./commands/' + args.primaryOption)
const result = commandFunction(args)

console.trueLog = console.log
if (args.silent === true) {
  // Disable Console.log
  console.log = () => {}
}

if (result instanceof Promise) {
  result
    .then(() => {
      //process.exit(0)
    })
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}
