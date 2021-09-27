const { join } = require('path')
const { removeSync } = require('fs-extra')
const { rmSync } = require('fs')
const { rm } = require('fs/promises')
const chai = require('chai')
const { expect } = chai
chai.use(require('chai-fs'))
const { createProject } = require('../../../src/index.js')
const { Options } = require('command-functions')
const { output } = require('../../../src/boilerplate/argsAliases')
const directoryExists = require('directory-exists')

const tests = [
  {
    name: 'test-1',
    sourceTemplate: 'rollup-test',
    description: 'Project creation working properly',
    subTests: {
      'no-input': {
        description: 'a basic rollup project with no cli arguments'
      }
    }
  }
]

const testRootDirectory = join(__dirname, '..')
const tempDirectory = join(testRootDirectory, 'tmp')
const sourcesDirectory = join(__dirname, '..', 'templates')

before(done => {
  rm(tempDirectory, { recursive: true })
    .then(() => {
      done()
    })
    .catch(err => {
      if (err?.code !== 'ENOENT') {
        done(err)
      } else {
        done()
      }
    })
})

tests.forEach(test => {
  const { name, description, sourceTemplate, subTests } = test
  if (typeof name != 'string' || name.length < 1) throw new Error('Must supply a test name')
  if (typeof description != 'string' || description.length < 1)
    throw new Error('Must supply a description')
  if (typeof sourceTemplate != 'string' || sourceTemplate.length < 1)
    throw new Error('Must supply a test name')

  if (typeof subTests != 'object' || subTests === null || Object.keys(subTests).length < 1)
    throw new Error('No subtests provided')
  //expect(path).to.be.a.directory(?msg).and.deep.equal(otherPath, ?msg)
  describe(description, () => {
    Object.entries(subTests).forEach(([subTestName, subTestOptions]) => {
      const testComparisonDirectory = join(testRootDirectory, 'expectedOutputs', name, subTestName)
      it(subTestOptions.description, async function () {
        this.timeout(1000 * 60 * 2) // Timeout after 2 minutes
        const tempOutputPath = join(tempDirectory, name, subTestName)
        const outputGitPath = join(tempOutputPath, '.git')
        const nodeModulesPath = join(tempOutputPath, 'node_modules')
        // To Do: Actually generate the project
        await createProject(
          join(sourcesDirectory, sourceTemplate),
          tempOutputPath,
          new Options({ noLaunch: true, silent: true })
        )
        try {
          await rm(outputGitPath, { recursive: true }) // delete the .git folder for comparison
        } catch (err) {}
        try {
          await rm(nodeModulesPath, { recursive: true }) // delete the node_modules  folder for comparison
        } catch (err) {}
        expect(tempOutputPath).to.be.a.directory().and.equal(testComparisonDirectory)
      })
    })
  })
})

// after(done => {
//   removeSync(tempDirectory)
//   done()
// })
