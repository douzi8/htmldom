const TAG_NAME = /^[\w-]+/
const WHITE_SPACE = /^\s+/
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
 *     { name: 'id', operator: '=', value: '' }
 *   ] 
 * }]
 * 
 * div .title
 * [{
 *    name: '',
 *    class: ['title'] 
 * }, {
 *    name: 'div',
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


function match () {

}


module.exports = {
  parser,
  match
}