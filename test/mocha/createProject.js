const { join } = require('path')
const { removeSync } = require('fs-extra')
const chai = require('chai')
const { expect } = chai
chai.use(require('chai-fs'))
const createProject = require('../../src/commands/create-project')
const { output } = require('../../src/boilerplate/argsAliases')

const tests = [
  {
    name: 'test-1',
    sourceTemplate: 'rollup',
    description: 'The rollup template functions correctly',
    subTests: {
      'no-input': {
        description: 'a basic rollup project with no cli arguments'
      }
    }
  }
]

const testRootDirectory = join(__dirname, '..')
const tempDirectory = join(testRootDirectory, 'tmp')
before(() => {
  removeSync(tempDirectory)
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
      it(subTestOptions.description, function (done) {
        this.timeout(1000 * 60 * 2) // Timeout after 2 minutes
        const tempOutputPath = join(tempDirectory, name, subTestName)
        const outputGitPath = join(tempOutputPath, '.git')
        removeSync(tempOutputPath)
        // To Do: Actually generate the project
        createProject({
          projectPath: tempOutputPath,
          templateDirectory: sourceTemplate,
          silent: true
        })
          .then(() => {
            removeSync(outputGitPath)
            expect(tempOutputPath).to.be.a.directory().and.equal(testComparisonDirectory)
            done()
          })
          .catch(error => {
            done(error)
          })
      })
    })
  })
})

after(() => {
  removeSync(tempDirectory)
})
