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
  '--list-roots': Boolean,
  '--lr': '--list-roots',
  '--list-templates': Boolean,
  '--lt': '--list-templates',
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
  '--at': '--add-template',
  '--remove-root': String,
  '--rr': '--remove-root',
  '--remove-template': String,
  '--rt': '--remove-template'
}

const args = arg(argsTemplate, {permissive: true})
const removeLeadingDashes = /^[\-]*/

const primaryOptionNames = ["configure", "generate", "list", "help", "open", "describe", 'get-directory', 'version', 'add-root', 'add-template', 'list-roots', 'remove-root', 'remove-template']
let primaryOptions = Object.entries(args)
primaryOptions = primaryOptions.map(([originalName, value]) => {
  let name = originalName
  if (name === "_") {
    name = (value[0] || "").toString()
    value = value.slice(1)
    //if (value.length < 1) value = []
  } else if (!name.startsWith('-')) {
    name = "--" + name
  }
  let matchingAlias = true
  while (matchingAlias) {
    matchingAlias = argsTemplate.hasOwnProperty(name) ? name : argsTemplate.hasOwnProperty('-' + name) ? '-' + name : argsTemplate.hasOwnProperty('--' + name) ? '--' + name : null
    if (typeof argsTemplate[matchingAlias] == 'string') {
      name = argsTemplate[matchingAlias]
    } else {
      matchingAlias = null
    }
  }
  name = name.replace(removeLeadingDashes, '')
  if (!args.hasOwnProperty("--" + name)) args["--" + name] = []
  if (originalName === "_") {
    if (!primaryOptionNames.includes(name)) {
      if (value.length < 1) {
        name = "help"
      } else {
        name = "generate"
      }
    }

    args["--" + name] = (args["--" + name] || []).concat((args._ || []).slice(1))
    delete args._
  }
  return name
}).filter((name) => {
  return primaryOptionNames.includes(name)
})

// Deprecated
// if (primaryOptions.length < 1 && primaryOptionNames.includes(args._[0].replace(removeLeadingDashes, ''))) {
//   const command = '--'+args._[0]
//   args._ = args["--" + command] = args._.slice(1)
//   primaryOptions.push([command])
// }

if (primaryOptions.length > 1) throw new Error("Too Many Primary Options")
//if (primaryOptions.length < 1) primaryOptions[0] = ["help"]

const primaryOption = primaryOptions[0] || "help"
const commandFunction = require("./commands/" + primaryOption)
const result = commandFunction(args)

if (result instanceof Promise) {
  result.then(()=>{
    //process.exit(0)
  }).catch(error => {
    console.error(error)
    process.exit(1)
  })
}
