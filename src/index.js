#!/usr/bin/env node
const resolveCommandAlias = require('./functions/resolveCommandAlias')
const argsAliases = require('./boilerplate/argsAliases')

const args = require('./functions/getArgs')()

const commandFunction = require('./commands/' + args.primaryOption)

const result = commandFunction(args)

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
