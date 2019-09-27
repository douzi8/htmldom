let QuerySelector = require('./query.selector')
let HtmlParser = require('./html.parser')
const { isUndefined, isString, isFunction } = require('./util')
const { getHtml, getOuterHTML } = require('./get.html')
const { updateAttrValue, cloneNode } = require('./node.op')


function insertChild (q, content, type) {
  let { nodes } = new HtmlParser(content)

  for (let item of q) {
    let newNodes = nodes.map(node => {
      let newNode = cloneNode(node)
      newNode.parent = item

      return newNode
    })

    if (type === 'append') {
      item.children = item.children.concat(newNodes)
      return
    }

    // prepend
    item.children = [...newNodes, ...item.children]
  }
}

class $Elements extends QuerySelector {
  constructor (selector, rootNode) {
    super(selector, rootNode)
  }
  /**
   * @example
   * $('').html()                 => Get html code
   * $('').html('<div></div>')    => Set html code
   */
  html (content) {
    if (isUndefined(content)) {
      let node = this[0]

      return node ? getHtml(node) :  null
    }


    let { nodes } = new HtmlParser(content) 

    for (let item of this) {
      item.children = nodes.map(node => {
        node.parent = item

        return node
      })
    }

    return this
  }
  /**
   * @example
   * $('').outerHTML()
   */
  outerHTML () {
    if (!this.length) {
      return null
    }

    return getOuterHTML(this[0])
  }
  /**
   * @example
   * $('#id').clone()
   */
  clone () {
    let newNodes = []

    for (let item of this) {
      newNodes.push(cloneNode(item))
    }

    return new $Elements(newNodes)
  }

  /**
   * @example
   * $('ul').append('<li>1<li>2')
   */
  append (content) {
    insertChild(this, content, 'appned')

    return this 
  }

  /**
   * @example
   * $('ul').prepend('<li>1<li>2')
   */
  prepend (content) {
    insertChild(this, content, 'prepend')

    return this 
  }

  before () {

  }

  after () {

  }

  /**
   * @example
   * $('').remove()
   */
  remove () {
    for (let item of this) {
      let parent = item.parent || this.__root__

      let pos = parent.children.indexOf(item)

      parent.children.splice(pos, 1)
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