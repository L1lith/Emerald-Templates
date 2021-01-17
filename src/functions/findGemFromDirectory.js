const nonEssentialCharacters = /[\s\-]+/g
const getAvailableGems = require('./getAvailableGems')

async function findGemFromDirectory(directory, originalGemName) {
  const gemName = originalGemName.toLowerCase().replace(nonEssentialCharacters, '')
  if (gemName.length < 1) throw new Error('Invalid Gem Name')
  let potentialGems
  if (directory === null) throw new Error('That was weird, an unexpected error occurred')
  try {
    potentialGems = await getSubdirectories(join(directory, 'gems'))
  } catch (error) {
    console.error(error)
    return null
  }
  for (let i = 0; i < potentialGems.length; i++) {
    const directoryName = potentialGems[i].toLowerCase().replace(nonEssentialCharacters, '')
    if (directoryName.length < 1) {
      console.warn('Template had an invalid gem name')
      continue
    }
    if (directoryName === gemName) return join(directory, 'gems', potentialGems[i])
  }
  return null
}

module.exports = findGemFromDirectory
