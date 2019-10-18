let QuerySelector = require('./query.selector')
let HtmlParser = require('./html.parser')
const { isUndefined, isString, isFunction } = require('./util')
const { getHtml, getOuterHTML } = require('./get.html')
const { updateAttrValue, cloneNode } = require('./node.op')
const { GET_NODE_PARENT } = require('./private.key')


function insertChild (parent, children, pos) {
  let newNodes = children.map(node => {
    let newNode = cloneNode(node)

    newNode.parent = parent.type === 'root' ? null : parent

    return newNode
  })

  parent.children.splice(pos, 0, ...newNodes)
}

class $Elements extends QuerySelector {
  constructor (selector, rootNode) {
    super(selector, rootNode)
  }
  /**
   * @example
   * $('').each(function(index, item) {})
   */
  each (callback) {
    for (let i = 0; i < this.length; i++) {
      let item = this[i]

      callback.call(item, i, item)
    }

    return this
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

    let nodes

    for (let item of this) {
      if (item.tagType === 'rawTag') {
        item.textContent = content
        continue
      }

      if (!nodes) {
        let parser = new HtmlParser(content) 
        nodes = parser.nodes
      }

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
    let { nodes } = new HtmlParser(content)

    for (let item of this) {
      insertChild(item, nodes, item.children.length)
    }

    return this 
  }

  /**
   * @example
   * $('ul').prepend('<li>1<li>2')
   */
  prepend (content) {
    let { nodes } = new HtmlParser(content)

    for (let item of this) {
      insertChild(item, nodes, 0)
    }

    return this 
  }
  /**
   * @example
   * $('li').before('<li>1<li>2')
   */
  before (content) {
    let { nodes } = new HtmlParser(content)

    for (let item of this) {
      let parent = this[GET_NODE_PARENT](item) 
      let pos = parent.children.indexOf(item)

      insertChild(parent, nodes, pos)
    }

    return this
  }
  /**
   * @example
   * $('li').after('<li>1<li>2')
   */
  after (content) {
    let { nodes } = new HtmlParser(content)

    for (let item of this) {
      let parent = this[GET_NODE_PARENT](item)
      let pos = parent.children.indexOf(item)

      insertChild(parent, nodes, pos + 1)
    }

    return this
  }
  /**
   * @example
   * $('div').replaceWith('<view>1</view>')
   */
  replaceWith (content) {
    return this.before(content).remove()
  }

  /**
   * @example
   * $('').remove()
   */
  remove () {
    for (let item of this) {
      let parent = this[GET_NODE_PARENT](item)

      let pos = parent.children.indexOf(item)

      parent.children.splice(pos, 1)
    }

    return this
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
  /**
   * @example
   * $('').css('height')               // get
   * $('').css('height', '200px')      // set
   * $('').css('height', null)         // remove
   * $('').css({ width: '200px', height: '200px'})
   */
  css (key, value) {
    let newStyle = key

    if (isString(key)) {
      if (isUndefined(value)) {
        return this.length ? this[0].style[key] : null
      }

      newStyle = {
        [key]: value
      }
    }

    for (let item of this) {
      let oldStyle = item.style

      item.style = {
        ...oldStyle,
        ...newStyle
      }
    }

  }

}


module.exports = $Elements