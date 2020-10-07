#!/usr/bin/env node
const arg = require('arg')

const argsTemplate = {
  '--configure': Boolean,
  '--config': '--configure',
  '-c': '--configure',
  '--generate': Boolean,
  '-g': '--generate',
  '--list': Boolean,
  '--ls': '--list',
  '-l': "--list",
  '--help': Boolean,
  '-h': '--help',
  '--template': String,
  '-t': '--template',
  '--outputFolder': String,
  '--output': '--outputFolder',
  '--open': String,
  '-o': '--open',
  '--describe': String,
  '--info': '--describe',
  '-d': '--describe',
  '--get-directory': String,
  '--gd': '--get-directory',
  '--version': Boolean,
  '-v': '--version',
  '--add-root': String,
  '--ar': '--add-root',
  '--add-template': String,
  '--at': '--add-template'
}

const args = arg(argsTemplate, {permissive: true})

const primaryOptionNames = ["--configure", "--generate", "--list", "--help", "--open", "--describe", '--get-directory', '--version', '--add-root', '--add-template']
const primaryOptions = Object.entries(args).filter(([name, value]) => primaryOptionNames.includes(name) && value === true)

if (primaryOptions.length < 1 && primaryOptionNames.includes('--' + args._[0])) {
  const command = '--'+args._[0]
  args._ = args[command] = args._.slice(1)
  primaryOptions.push([command])
}

if (primaryOptions.length > 1) throw new Error("Too Many Primary Options")
if (primaryOptions.length < 1 && args._.length < 1) primaryOptions[0] = ["--help"]

const primaryOption = (primaryOptions[0] || [])[0] || "--generate"
const commandFunction = require("./commands/" + primaryOption.substring(2))
const result = commandFunction(args)

if (result instanceof Promise) {
  result.then(()=>{
    //process.exit(0)
  }).catch(error => {
    console.error(error)
    process.exit(1)
  })
}
