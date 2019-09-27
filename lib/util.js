function getTypeof(obj) {
  return Reflect.apply(Object.prototype.toString, obj, []).match(
    /\s+(\w+)\]$/
  )[1]
}


function isUndefined (obj) {
  return obj === void 0
}

function isString (obj) {
  return typeof obj === 'string'
}


function isNull (obj) {
  return obj === null
}

function isFunction(obj) {
  return getTypeof(obj) == 'Function'
}

module.exports = {
  isUndefined,
  isString,
  isNull,
  isFunction
}