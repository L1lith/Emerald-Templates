#!/usr/bin/env node
const { CommandFunctions } = require('command-functions')
const commands = require('./commands')

const app = new CommandFunctions(commands)

module.exports = app.autoRun()
