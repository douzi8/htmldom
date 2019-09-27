let QuerySelector = require('./query.selector')
let HtmlParser = require('./html.parser')
const { isUndefined } = require('./util')
const { getOuterHTML, getHtml } = require('./get.html')


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
}


module.exports = $Elements