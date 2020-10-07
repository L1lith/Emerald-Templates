function setDefaultValue(object, key, value) {
  Object.defineProperty(object, key, {
    get: () => value,
    set: newValue => {
      Object.defineProperty(object, key, {
        value: newValue,
        enumerable: true,
        configurable: true,
        writable: true
      })
    },
    enumerable: false,
    configurable: true
  })
}

module.exports = setDefaultValue
