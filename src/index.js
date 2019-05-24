const arg = require('arg')

const args = arg({
  '--configure': Boolean,
  '-c': '--configure',
  '--generate': Boolean,
  '-g': '--generate',
  '--template': String,
  '-t': '--template',
  '--outputFolder',
  '--output': '--outputFolder',
  '-o': '--outputFolder'
})

const primaryOptionNames = ["--configure", "--generate"]

const primaryOptions = Object.entries(args).filter(([name, value]) => primaryOptionNames.includes(name) && value === true)
if (primaryOptions.length > 1) throw new Error("Too Many Primary Options")
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
