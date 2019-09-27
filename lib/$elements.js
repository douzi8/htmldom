let QuerySelector = require('./query.selector')
let HtmlParser = require('./html.parser')
const { isUndefined, isString, isFunction, isNull } = require('./util')
const { getOuterHTML, getHtml } = require('./get.html')


function updateAttrValue (node, key, value) {
  if (isNull(value)) {
    delete node.attributes[key]
    return
  }

  node.attributes[key] = value 
}

class $Elements extends QuerySelector {
  constructor (selector, rootNode) {
    super(selector, rootNode)
  }

  html (content) {
    if (isUndefined(content)) {
      let node = this[0]


      return node ? getHtml(node) : null
    }
  }
  /**
   * @example
   * $('').addClass('cls')
   * $('').addClass('cls cls2')
   */
  addClass (name) {
    name = name.split(/\s+/)

    for (let item of this) {
      let classList = item.classList
      
      name.forEach(item => {
        classList.add(item)
      })

      item.classList = classList
    }


    return this
  }

  /**
   * @example
   * $('').removeClass()      clear all class 
   * $('').removeClass('one')
   * $('').removeClass('one two')  
   */
  removeClass (cls) {
    let isClear = isUndefined(cls)
    let removeList = isClear ? null : cls.split(/\s+/)

    for (let item of this) {
      let classList =  item.classList

      if (isClear) {
        classList.clear()
      } else {
        removeList.forEach(item => {
          classList.delete(item)
        })
      }

      item.classList = classList
    }

    return this
  }
  /**
   * @example
   * $('').hasClass('cls')
   */
  hasClass (cls) {
    for (let item of this) {
      let classList =  item.classList

      if (classList.has(cls)) return true
    }

    return false
  }
  /**
   * @example
   * $('').attr('key', 'value')   // assign
   * $('').attr('key', function(index,oldValue) {});
   * $('').attr({
   *   k1: 'v1',
   *   'data-id': 'v2'
   * });              // multiple assign
   * $('').attr('key', null)      // remove attr
   */
  attr (key, value) {
    let attrObj = key

    if (isString(key)) {
      if (isUndefined(value)) {
        return this.length ? this[0].attributes[key] : null
      }

      if (isFunction(value)) {
        for (let i = 0; i < this.length; i++) {
          updateAttrValue(this[i], key, value(i, this[i].attributes[key]))
        }

        return this
      }

      attrObj = {
        [key]: value
      }
    }

    for (let item of this) {
      for (let attrKey in attrObj) {
        updateAttrValue(item, attrKey, attrObj[attrKey])
      }
    }

    return this
  }

}


module.exports = $Elements