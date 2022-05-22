#!/usr/bin/env node
const CommandFunctions = require('command-functions/CommandFunctions')
const commands = require('./commands')
const symbols = require('./boilerplate/symbols')

const app = new CommandFunctions(commands, { exports: { symbols } })

if (require.main === module) {
  // It's being run by the terminal
  //throw process.argv
  app
    .runCLI(process.argv)
    .then(() => {
      process.exit(0)
    })
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
} else {
  // It's a module
  module.exports = app.getExports()
}
