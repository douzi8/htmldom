const TAG_NAME = /^[\w-]+/
const WHITE_SPACE = /^\s*([>+~])?\s*/
const CLASS_NAME = /^\.([\w-]+)/
const ID = /^#([\w-]+)/
const ALL = /^\*/
const ATTR = /^\[([^\]]+)\]/

const SPLIT_ATTR = /\s*([\^$~*])?=\s*(?:'([^']*)'|"([^"]*)"|([^\s]+))/

class Tokenize {
  constructor (selector) {
    this.selector = selector.trim()

    if (!this.selector) {
      this.nodes = null
      return
    }

    this.nodes = [{}]

    this.scan()
  }

  scan () {
    let selector = this.selector

    while (this.selector) {
      if (this.tagName()) {
        continue
      }

      if (this.className()) {
        continue
      }

      if (this.idName()) {
        continue
      }

      if (this.all()) {
        continue
      }

      if (this.attrs()) {
        continue
      }


      if (this.whitespace()) {
        continue
      }

      

      throw new Error(selector + ' is not a valid selector');
    }
  }

  /**
   * match content step by step
   * @example
   * this.match(/^<([\w-]+)/)
   */
  match (reg) {
    let match = this.selector.match(reg)

    if (!match) {
      return false
    }

    this.selector = this.selector.slice(match[0].length)

    return match
  }
  /**
   * @example
   * div   =>   { name: 'div' }
   */
  tagName () {
    let match = this.match(TAG_NAME)

    if (!match) return false

    let node = this.getCurrentNode()

    node.name = match[0]

    return true
  }
  /**
   * @examole
   * .cls1.cls2  =>  { class: ['cls', 'cls2']}
   */
  className () {
    let match = this.match(CLASS_NAME)

    if (!match) return false

    let node = this.getCurrentNode()

    if (!node.class) {
      node.class = []
    }

    node.class.push(match[1])

    return true
  }
  /**
   * @example 
   * #title  =>  { attrs: [{ key: 'id', operator: '=', value: 'title' }]}
   */
  idName () {
    let match = this.match(ID)

    if (!match) return false

    let node = this.getCurrentNode()

    if (!node.attrs) {
      node.attrs = []
    }

    node.attrs.push({
      key: 'id',
      operator: '=',
      value: match[1]
    })

    return true
  }
  /**
   * '*'
   */
  all () {
    let match = this.match(ALL)

    if (!match) return false

    let node = this.getCurrentNode()

    node.operator = '*'

    return true
  }

  /**
   * @example
   * [key='v']      => attrs: [{ key: 'key', operator: '=', value: 'v'}]
   * [key]          => attrs: [{ key: 'key', operator: ''}]
   * [key *= 'v']   => attrs: [{ key: 'key', operator: '*', value: 'v'}]
   */
  attrs () {
    let match = this.match(ATTR)

    if (!match) return false

    let node = this.getCurrentNode()

    if (!node.attrs) {
      node.attrs = []
    }
    let attrsStr = match[1]
    let attrsMatch = attrsStr.match(SPLIT_ATTR)
    let key
    let operator = ''
    let value = ''

    if (attrsMatch) {
      key = attrsStr.substr(0, attrsMatch.index)
      operator = attrsMatch[1] ? attrsMatch[1] : '='
      value = attrsMatch[2] || attrsMatch[3] || attrsMatch[4]
    } else {
      key = attrsStr
    }

    node.attrs.push({
      key,
      operator,
      value
    })

    return true
  }

  whitespace () {
    let match = this.match(WHITE_SPACE)

    if (!match) return false

    let operator = match[1] || '' 

    let current = this.nodes[0]

    if (!current) return false

    current.operator = operator

    this.nodes.unshift({})

    return true
  }


  getCurrentNode () {
    return this.nodes[0]
  }
}

/**
 * Parse css3 selector
 *
 * @example
 * div.cls#id > a
 * [{
 *   name: 'a',
 *   attrs: [] 
 * }, {
 *   name: div,
 *   class: ['cls'],
 *   operator: '>'
 *   attrs: [
 *     { key: 'id', operator: '=', value: '' }
 *   ] 
 * }]
 * 
 * div .title
 * [{
 *    name: '',
 *    class: ['title'] 
 * }, {
 *    key: 'div',
 *    operator: ' '
 * }]
 *  
 * *
 * [{
 *  operator: '*'
 *}]
 */
function parser (selector) {
  let result = new Tokenize(selector)

  return result.nodes
}


/**
 * @example
 * matchClass(['title', 'header'], ['title'])   => true
 * matchClass(['title', 'header'], ['body'])   => false
 */
function matchClass(cls1, cls2) {
  let result = new Set(cls1.concat(cls2))

  return cls1.length === [...result].length
}

/**
 * validate the selector is match node
 * @example
 * match({
 *  name: 'div',
 *  attributes: {
 *    class: ''  
 *  } 
 *})
 */
function match (node, selector) {
  if (selector.name && node.name !== selector.name) {
    return false
  }

  let className = selector.class || []
  let nodeClass = node.attributes.class || ''

  if (!matchClass(nodeClass.split(/\s+/), className)) return false

  let attrs = selector.attrs || []

  for (let item of attrs) {
    let nodeValue = node.attributes[item.key] || ''
    let selectorValue = item.value

    switch (item.operator) {
      case '=':
        if (nodeValue !== selectorValue) return false
        break
      case '^':
        if (!nodeValue.startsWith(selectorValue)) return false
        break
      case '$':
        if (!nodeValue.endsWith(selectorValue)) return false
        break
      case '*':
        if (!nodeValue.includes(selectorValue)) return false
        break
      case '~':
        var reg = new RegExp('(^|\\b)' + selectorValue + '(\\b|$)');
        if (!reg.test(nodeValue)) return false
        break
      default:
        if (!Reflect.has(node.attributes, item.key)) return false
    } 
  }


  return true
}


module.exports = {
  parser,
  match
}