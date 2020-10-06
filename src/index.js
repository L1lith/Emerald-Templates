#!/usr/bin/env node
const arg = require('arg')

const args = arg({
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
  '-d': '--describe',
  '--getDirectory': String,
  '--gd': '--getDirectory'
}, {permissive: true})

const primaryOptionNames = ["--configure", "--generate", "--list", "--help", "--open", "--describe", '--getDirectory']
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
