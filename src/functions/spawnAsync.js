const { spawn } = require('child_process')
const { parseArgsStringToArgv } = require('string-argv')

const defaultOptions = { stdio: 'inherit', stdin: 'inherit', shell: true }

function spawnAsync(command, optionsIn = {}) {
  return new Promise((resolve, reject) => {
    const options = { ...defaultOptions, optionsIn }
    let args = parseArgsStringToArgv(command)
    let cmd = args.shift()
    if (cmd === 'npm' && /^win/.test(process.platform)) cmd = 'npm.cmd'

    let step = spawn(cmd, args, options)

    step.on('close', code => {
      if (code === 0) {
        resolve(code)
      } else {
        reject(code)
      }
    })
  })
}

module.exports = spawnAsync
