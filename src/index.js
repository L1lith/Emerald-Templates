#!/usr/bin/env node
const args = require('yargs').argv

const argsAliases = {
  //'--configure': Boolean,
  'config': 'configure',
  'c': 'configure',
  //'--generate': Boolean,
  'g': 'generate',
  //'--list': Boolean,
  'ls': 'list',
  'l': "list",
  //'--list-roots': Boolean,
  'lr': 'list-roots',
  //'--list-templates': Boolean,
  'lt': 'list-templates',
  //'help': Boolean,
  'h': 'help',
  //'template': String,
  't': 'template',
  //'outputFolder': String,
  'output': 'outputFolder',
  //'open': String,
  'o': 'open',
  //'describe': String,
  'info': 'describe',
  'd': 'describe',
  //'get-directory': String,
  'gd': 'get-directory',
  //'--version': Boolean,
  'v': 'version',
  //'--add-root': String,
  'ar': 'add-root',
  //'--add-template': String,
  'at': 'add-template',
  //'--remove-root': String,
  'rr': 'remove-root',
  //'--remove-template': String,
  'rt': 'remove-template'
}

//const args = arg(argsTemplate, {permissive: true})

const removeLeadingDashes = /^[\-]*/

const primaryOptionNames = ["configure", "generate", "list", "help", "open", "describe", 'get-directory', 'version', 'add-root', 'add-template', 'list-roots', 'remove-root', 'remove-template']

Object.keys(argsAliases).forEach(alias => {
  if (args.hasOwnProperty(alias)) {
    const oldValue = args[alias]
    delete args[alias]
    const newName = argsAliases[alias]
    if (args.hasOwnProperty(newName)) throw new Error("Cannot supply the same option twice")
    args[newName] = oldValue
  }
})

if (!args.hasOwnProperty('_')) args._ = []

let providedOptions = Object.entries(args)

let primaryOptions = Object.keys(args).filter(name => {
  return primaryOptionNames.includes(name)
})

if (primaryOptions.length < 1) {
  if (args._.length > 0) {
    const primaryOption = args._[0]
    if (primaryOptionNames.includes(primaryOption)) {
      primaryOptions.push(primaryOption)
      if (args.hasOwnProperty(primaryOption)) throw new Error("Unexpected State")
      if (args._.length > 1) {
        args[primaryOption] = args._.slice(1)
      } else {
        args[primaryOption] = true
      }
      args._ = []
    } else {
      primaryOptions.push('generate')
      if (args.hasOwnProperty('generate')) throw new Error("Unexpected State")
      args.generate = args._
      delete args._
    }
  } else {
    primaryOptions.push('help')
    args.help = true
  }
}
//console.log(args)
if (typeof primaryOptions[0] != 'string' || primaryOptions[0].length < 1) throw new Error ("Must supply a valid primary option")
if (primaryOptions.length > 1) throw new Error("Too Many Primary Options")
//if (primaryOptions.length < 1) primaryOptions[0] = ["help"]
//console.log({args})
const primaryOption = primaryOptions[0]
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
