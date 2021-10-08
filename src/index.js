#!/usr/bin/env node
const { CommandFunctions } = require('command-functions')
const commands = require('./commands')
const symbols = require('./boilerplate/symbols')

const app = new CommandFunctions(commands, { exports: { symbols } })

module.exports = app.autoRun()
