function getPathName(name) {
  return name.toLowerCase().trim().replace(/\s+/g, '-')
}

module.exports = getPathName
