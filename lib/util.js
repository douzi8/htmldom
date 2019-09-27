function isUndefined (obj) {
  return obj === void 0
}

function isString (obj) {
  return typeof obj === 'string'
}

module.exports = {
  isUndefined,
  isString
}