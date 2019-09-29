(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.createHtmlDom = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let $Elements = require('./lib/$elements.js')
let HtmlParser = require('./lib/html.parser')
const { getHtml } = require('./lib/get.html')
const uglifyOuterHTML = require('./lib/uglify')
const beautifyOuterHTML = require('./lib/beautify')


/**
 * @example
 * let $ = createHtmlDom('<div><a></a></div>')
 * 
 * $('div a').addClass('title').html()
 * $.nodes
 * $.root().prepend('<head></head>')
 * $.html()
 * $.beautify()
 * $.uglify()
 *
 */
function createHtmlDom (code) {
  let { nodes } = new HtmlParser(code)

  function htmldom (selector) {
    return new $Elements(selector, {
      type: 'root',
      children: nodes
    })
  }

  Object.defineProperty(htmldom, 'nodes', {
    value: nodes
  })

  htmldom.root = function () {
    return new $Elements({
      type: 'root',
      children: nodes
    })
  }

  htmldom.html = function () {
    return getHtml({
      type: 'root',
      children: nodes
    })
  }

  htmldom.uglify = function (options) {
    options = {
      removeAttributeQuotes: false,
      ...options
    }

    let html = ''


    for (let i = 0; i < nodes.length; i++) {
      html += uglifyOuterHTML(nodes[i], options)
    }

    return html
  }

  htmldom.beautify = function (options) {
    options = {
      indent: '  ',
      ...options
    }

    let html = ''

    for (let i = 0; i < nodes.length; i++) {
      html += beautifyOuterHTML(nodes[i], options.indent, 0)
    }

    return html.trim()
  }



  return htmldom
}



module.exports = createHtmlDom
},{"./lib/$elements.js":2,"./lib/beautify":3,"./lib/get.html":4,"./lib/html.parser":5,"./lib/uglify":10}],2:[function(require,module,exports){
let QuerySelector = require('./query.selector')
let HtmlParser = require('./html.parser')
const { isUndefined, isString, isFunction } = require('./util')
const { getHtml, getOuterHTML } = require('./get.html')
const { updateAttrValue, cloneNode } = require('./node.op')


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
      callback.call(this, i, this[i])
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
      let parent = item.parent || this.__root__
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
      let parent = item.parent || this.__root__
      let pos = parent.children.indexOf(item)

      insertChild(parent, nodes, pos + 1)
    }

    return this
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
},{"./get.html":4,"./html.parser":5,"./node.op":6,"./query.selector":7,"./util":11}],3:[function(require,module,exports){
const { getAttributesCode } = require('./node.op')


function getNewLineIndent(indent, depth) {
  var str = ''

  while (depth--) {
    str += indent
  }

  return '\n' + str
}

function hasElement (children) {
  return children.find(item => item.type === 'tag')
}

function beautifyRawTag (name, value, newline) {
  if (!value.trim()) {
    return `</${name}>`
  }

  return `${value}${newline}</${name}>`
}

function beautifyText (value, newline) {
  value = value.trim()

  if (!value) return ''

  return newline + value
}

/**
 * @example
 * <button>click</button>
 */
function beautifyTextChildren(children) {
  let result = ''

  for (let item of children) {
    if (item.type === 'comment') {
      result += `<!-- ${item.data} -->`
      continue
    }

    result += item.data.trim()
  }

  return result
}

/**
   * Get a node's html code
   * 
   * @example
   * {
   *   type: 'tag',
   *   children: [{ type: 'text', value: 1 }],
   *   name: 'div' 
   * }
   * <div>1</div>
   */
function beautifyOuterHTML ({
  name, 
  type, 
  tagType, 
  children,
  attributes,
  data,
  textContent
}, indent, depth) {
  let code = []
  let newline = getNewLineIndent(indent, depth)

  switch (type) {
    case 'tag':
      code.push(`${newline}<${name}${getAttributesCode(attributes)}`)

      if (tagType === 'selfClosingTag') {
       // <img src="" />
        code.push('/>')
      } else if (tagType === 'voidTag') {
        // <br>
        code.push('>')
      } else {
        code.push('>')

        if (tagType === 'rawTag') {
          code.push(beautifyRawTag(name, textContent, newline))
        } else {
          let flag = hasElement(children)

          if (flag) {
            for (let item of children) {
              code.push(beautifyOuterHTML(item, indent, depth + 1))
            }

            code.push(`${newline}</${name}>`)
          } else {
            code.push(`${beautifyTextChildren(children)}</${name}>`)
          }
        }
      }

      break
    case 'text':
      code.push(beautifyText(data, newline))
      break
    case 'comment':
      code.push(`${newline}<!--${data}-->`)
      break
  }

  return code.join('')
}


module.exports = beautifyOuterHTML
},{"./node.op":6}],4:[function(require,module,exports){
const { getAttributesCode } = require('./node.op')

/**
   * Get a node's html code
   * 
   * @example
   * {
   *   type: 'tag',
   *   children: [{ type: 'text', value: 1 }],
   *   name: 'div' 
   * }
   * <div>1</div>
   */
function getOuterHTML ({
  name, 
  type, 
  tagType, 
  children,
  attributes,
  data,
  textContent
}) {
  let code = []

  switch (type) {
    case 'tag':
      code.push(`<${name}${getAttributesCode(attributes)}`)

      if (tagType === 'selfClosingTag') {
       // <img src="" />
        code.push('/>')
      } else if (tagType === 'voidTag') {
        // <br>
        code.push('>')
      } else {
        code.push('>')

        if (tagType === 'rawTag') {

          code.push(textContent)
        } else {
          for (let item of children) {
            code.push(getOuterHTML(item))
          }
        }

        code.push(`</${name}>`)
      }

      break
    case 'text':
      code.push(data)
      break
    case 'comment':
      code.push(`<!--${data}-->`)
      break
  }

  return code.join('')
}

function getHtml (node) {
  let html = '';
  let children = node.children;

  for (let i = 0; i < children.length; i++) {
    html += getOuterHTML(children[i])
  }

  return html
}

module.exports = {
  getOuterHTML,
  getHtml
}
},{"./node.op":6}],5:[function(require,module,exports){
const OPTIONAL_TAGS = {
  head: ['body'],
  /**
   * </li>可以在以下两种情况下缺省
   * 1. <li>紧挨着另一个<li>
   * 2. 父亲元素没有更多的内容
   *
   * @example
   * <ul>
   *  <li> 1
   *  <li> 2
   * </ul>
   */
  li: ['li'],
  dt: ['dt', 'dd'],
  dd: ['dd', 'dt'],
  p: ['address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'main', 'menu', 'nav', 'ol', 'p', ' pre', 'section', 'table', 'ul'],
  option: ['option'],
  caption: ['caption', 'thead', 'tbody'],
  colgroup: ['tbody', 'tr', 'tfoot'],
  col: ['col', 'tbody', 'tr'],
  thead: ['tbody', 'tfoot'],
  tbody: ['tbody', 'tfoot'],
  tfoot: ['tbody'],
  tr: ['tr', 'tbody'],
  td: ['td', 'th', 'tr', 'tbody'],
  th: ['td', 'th', 'tr', 'tbody']
}

const Tokenize = require('./tokenize')

const { nodeClassList, nodeStyle } = require('./node.op')


/**
 * Parser html dom that is created by tokenize
 * @example
 * let { nodes } = new HtmlParser('<div></div>') 
 */
class HtmlParser {
  constructor(htmlCode) {
    let { doms } = new Tokenize(htmlCode)

    this.doms = doms
    this.nodes = this.traverse(null)
  }

  traverse(parent) {
    let doms = this.doms
    let nodes = []

    while (doms.length) {
      let item = this.shift()
      let node

      switch (item.type) {
        case 'openTag':
          node = this.matchOpenTag(parent, item)
          break
        case 'closeTag':
          if (this.matchCloseTag(parent, item)) {
            return nodes
          }

          break
        case 'rawTag':
        case 'voidTag':
        case 'selfClosingTag':
          node = {
            ...item,
            type: 'tag',
            tagType: item.type,
            children: []
          }
          break
        case 'text':
        case 'comment':
          node = item
          break
      }

      if (node) {
        node.parent = parent

        this.parseAttributes(node)

        nodeClassList(node)
        nodeStyle(node)

        nodes.push(node)
      }
    }

    return nodes
  }

  matchOpenTag(prev, node) {
    if (prev) {
      let optional = OPTIONAL_TAGS[prev.name]

      // optional tags
      if (optional && optional.includes(node.name)) {

        this.optionalTagClose(node, prev.name)

        return null
      }
    }

    node.type = 'tag'
    node.tagType = null
    node.children = this.traverse(node)

    return node
  }

  matchCloseTag(prev, node) {
    let nodeName = node.name

    if (prev) {
      if (prev.name === nodeName) return true

      let optional = OPTIONAL_TAGS[prev.name]

      /**
       * <ul><li></ul>
       */
      if (optional) {
        this.optionalTagClose(node, prev.name)
      }
    }
    


    /**
     * <div></div></p>
     */
    if (nodeName === 'p') {
      this.doms.unshift({
        type: 'openTag',
        attributes: '',
        name: nodeName
      }, node)
    }

    return false
  }
  /**
   * Convert attributes string to object
   * @example
   * Empty attribute syntax: <input disabled> (https://html.spec.whatwg.org/multipage/syntax.html#attributes-2)
   * Unquoted attribute value: <input value=yes>
   * Single-quoted attribute value: <input type='checkbox'>
   * Double-quoted attribute value: <input name="be evil">
   */
  parseAttributes(node) {
    if (node.type !== 'tag') return

    let attributes = node.attributes.trim()
    let result = {}
    let reg = /([^=\s]+)(?:\s*=\s*(?:'([^']*)'|"([^"]*)"|([^\s]*)))?/g
    let match = reg.exec(attributes)

    while (match) {
      let key = match[1]
      let value = match[2] || match[3] || match[4] || ''

      if (!Reflect.has(result, key)) {
        result[key] = value
      }
      
      match = reg.exec(attributes)
    }

    node.attributes = result
  }

  shift() {
    return this.doms.shift()
  }

  optionalTagClose (node, name) {
    this.doms.unshift({
      type: 'closeTag',
      name
    }, node)
  }
}


module.exports = HtmlParser
},{"./node.op":6,"./tokenize":9}],6:[function(require,module,exports){
const { isNull } = require('./util')


function updateAttrValue (node, key, value) {
  if (isNull(value)) {
    delete node.attributes[key]
    return
  }

  node.attributes[key] = value + ''
}

function cloneNode (node, parent) {
  if (!parent) parent = null

  let result = {
    ...node,
    parent
  }


  if (node.children) {
    let children = []
    
    node.children.forEach(item => {
      children.push(cloneNode(item, result))
    })

    result.children = children
  }

  if (node.attributes) {
    result.attributes = {
      ...node.attributes
    }

    nodeClassList(result)
    nodeStyle(result)
  }

  
  return result
}

function nodeClassList (node) {
  if (node.type !== 'tag') return

  Object.defineProperty(node, 'classList', {
    get () {
      let className = this.attributes.class

      let classList = className ? className.split(/\s+/) : []

      return new Set(classList)
    },

    set (value) {
      let result = [...value]

      if (result.length) {
        this.attributes.class = result.join(' ')
      } else {
        delete this.attributes.class
      }
    }
  })
}

const SEMICOLON =  /\s*;\s*/

/**
 * Set or get node's style
 * @example
 * node.style  => {}
 * node.style = { color: 'value '}
 */
function nodeStyle (node) {
  if (node.type !== 'tag') return

  Object.defineProperty(node, 'style', {
    get () {
      let style = this.attributes.style
      let result = {}

      if (!style) return result

      style = style.split(SEMICOLON)

      for (let item of style) {
         let index = item.indexOf(':')

        if (index !== -1) {
          let key = item.slice(0, index).trim()
          let value = item.slice(index + 1).trim()

          result[key] = value
        }
      }

      return result
    },
    set (obj) {
      if (!obj) {
        delete this.attributes.style
        return
      }

      let style = []

      for (let key in obj) {
        let value = obj[key]

        if (!isNull(value)) {
          style.push(`${key}:${value}`)
        }
      }

      if (style.length) {
        this.attributes.style = style.join(';')
      } else {
        delete this.attributes.style
      }
      
    }
  })
}

const DOUBLE_QUOTES = /"/g
const SPECIAL_ATTR_VALUE = /['"><\s=`]/

function getAttributesCode (attributes) {
  let result = ''
  
  for (let key in attributes) {
    let value = attributes[key]

    if (value) {
      result += ` ${key}="${value.replace(DOUBLE_QUOTES, '&quot;')}"`
    } else {
      result += ` ${key}`
    }
  }

  return result
}


function isScriptOrStyle (name, type) {
  let isScript = name === 'script' && type === 'text/javascript'
  let isStyle =  name === 'style' && type === 'text/css'

  return isScript || isStyle
}

function uglifyAttributesCode(name, attributes, removeAttributeQuotes) {
  let result = ''

  /**
   * <script type="text/javascript">   => <script>
   * <style type="text/css">   => <style>
   */
  if (isScriptOrStyle(name, attributes.type)) {
    attributes = {
      ...attributes
    }

    delete attributes.type
  }


  for (let key in attributes) {
    let value = attributes[key]

    if (value) {
      if (removeAttributeQuotes && !SPECIAL_ATTR_VALUE.test(value)) {
        result += ` ${key}=${value}`
        continue
      }

      result += ` ${key}="${value.replace(DOUBLE_QUOTES, '&quot;')}"`
      continue
    }

    result += ` ${key}`
  }

  return result
}


module.exports = {
  updateAttrValue,
  cloneNode,
  nodeClassList,
  nodeStyle,
  getAttributesCode,
  uglifyAttributesCode
}
},{"./util":11}],7:[function(require,module,exports){
let { parser : cssParser, match: cssMatch} = require('./selector')
const { isString, isFunction } = require('./util')


/**
 * DFS
 */
function depthFirstSearch (node, callback) {
  let stack = [...node.children]

  while (stack.length) {
    let current = stack.shift()
  
    if (current.type === 'tag') {
      callback(current)
    }      
    
    if (current.children) {
      stack = current.children.concat(stack)
    }
  }
}


let FILTER_CHILDREN = Symbol('filter')
let SET_LIST = Symbol('list')

function getPrevNodeSibling (node) {
  let parent = node.parent

  if (!parent) return null

  let children = parent.children.filter(node => node.type === 'tag')

  let pos = children.indexOf(node)

  let prev = children[pos - 1]

  return prev ? prev : null
}

function getPrevNodeSiblings (node) {
  let parent = node.parent

  if (!parent) return null

  let children = parent.children.filter(node => node.type === 'tag')

  let pos = children.indexOf(node)

  return pos === 0 ? null : children.slice(0, pos)
}

function filterNode (node, selectorData) {
  let length = selectorData.length
  let j = 0

  while (j < length) {
    let selector = selectorData[j]

    switch (selector.operator) {
      case '>':
        if (!node.parent || !cssMatch(node.parent, selector)) return false

        node = node.parent
        break
      case '+':
        let prev = getPrevNodeSibling(node)

        if (!prev || !cssMatch(prev, selector)) return false

        node = prev
        break
      case '~':
        let prevs = getPrevNodeSiblings(node)
        let hasMatch = false

        if (!prevs) return false

        let prevsLength = prevs.length
        
        while (prevsLength--) {
          let prevItem = prevs[prevsLength]

          if (cssMatch(prevItem, selector)) {
            hasMatch = true
            node = prevItem
            break
          }
        }  

        if (!hasMatch) return false

        break
      default:
        while (node) {
          node = node.parent

          if (!node) return false

          if (cssMatch(node, selector)) {
            break
          }
        }
    }

    j++
  }

  return true
}



class QuerySelector {
  /**
   * Query the node list by css selector
   * @example
   * let q = new QuerySelector('div .title', { children: []})
   */
  constructor (selector, rootNode) {
    if (isString(selector)) {
      this.selector = selector

      let selectorData = cssParser(selector)
      let list = []

      if (selectorData) {
        let first = selectorData.shift()

        this.__root__ = rootNode

        depthFirstSearch(rootNode, function (node) {
          if (cssMatch(node, first)) {
            list.push(node)
          }
        })
        
        this[FILTER_CHILDREN](list, selectorData)
      } else {
        this[SET_LIST](list)
      }
      
    } else {

      if (!Array.isArray(selector)) {
        selector = [selector]
      }

      this[SET_LIST](selector)
    }
    
  }
  /**
   * @see https://www.w3.org/TR/selectors-3/
   * E   F:  an F element descendant of an E element
   * E > F:  an F element child of an E element
   * E + F:  an F element immediately preceded by an E element
   * E ~ F:  an F element preceded by an E element
   */
  [FILTER_CHILDREN] (list, selectorData) {
    list = list.filter(function(node) {
      return filterNode(node, selectorData)
    })

    this[SET_LIST](list)
  }

  [SET_LIST] (list) {
    list.forEach((node, index) => {
      this[index] = node
    })

    this.__length__ = list.length
  }

  [Symbol.iterator]() { 
    let index = 0
    let self = this
    
    return {
      next () {
        if (index < self.length) {
          return {
            value: self[index++],
            done: false
          }
        }

        return {
          done: true
        }
      }
    } 
  }

  get length () {
    return this.__length__
  }

  /**
   * @example
   * $('div').find('a')
   */
  find (selector) {
    let result = new Set()

    for (let item of this) {
      let $ = new QuerySelector(selector, item)

      for (let j = 0; j < $.length; j++) {
        result.add($[j])
      }
    }

    let $elements = new this.constructor([...result])

    return $elements
  }
  /**
   * Get immediate parents of each element in the collection. 
   * If CSS selector is given, filter results to include only ones matching the selector
   * @example
   * $('').parent()
   * $('').parent('.cls')
   */
  parent (selector = '*') {
    let result = new Set()
    let selectorData = cssParser(selector)

    for (let item of this) {
      let parent = item.parent

      if (!parent || !selectorData) {
        continue
      }

      if (cssMatch(parent, selectorData[0])) {
        result.add(parent)
      }
    }

    let $elements = new this.constructor([...result])

    return $elements
  }
  /**
   * @example
   * $('').eq(0)     // first element
   * $('').eq(-1)    // last element
   */
  eq (index) {
    index = index < 0 ? this.length + index : index
    let result = index + 1 > this.length ? [] : this[index]

    return new this.constructor(result)
  }
  /**
   * @example
   * $('').filter('[data-id=1]')
   * $('').filter(function(index) {
   *   return $(this[index]).attr('data-id') == 1;
   * });
   */
  filter (callback) {
    let isFn = isFunction(callback)
    let result = []
    let selectorData = isFn ? null : cssParser(callback)
    
    for (let i = 0; i < this.length; i++) {
      let node = this[i]

      if (isFn) {
        if (callback.call(node, i, node)) {
          result.push(node)
        }
      } else {
        if (selectorData && cssMatch(node, selectorData[0])) {
          result.push(node)
        }
      }
    }

    return new this.constructor(result)
  }
}


module.exports = QuerySelector
},{"./selector":8,"./util":11}],8:[function(require,module,exports){
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
    let nodeValue = node.attributes[item.key]
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
},{}],9:[function(require,module,exports){
// <style, <script
const RAW_TAG = /^<(script|style|textarea)/
const STYLE_RAW = /([\s\S]*?)<\/style\s*>/
const SCRIPT_RAW = /([\s\S]*?)<\/script\s*>/
const  TEXTARE_RAW = /([\s\S]*?)<\/textarea\s*>/
  // <div
const  OPEN_TAG = /^<([\w-]+)/
  // >
const  OPEN_TAG_CLOSE = /^(?:'[^']*'|"[^"]*"|[^>])*>/
  // </div>
 const CLOSE_TAG =  /^<\/([\w-]+)\s*>/
  // <!-- -->
const COMMENT = /^<!--([\s\S]*?)-->/
const TEXT = /^[^<]+/
const WHITESPACE = /^\s+/

/**
 * 空元素标签
 * @see http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
 */
const VOID_ELEMENTS = [
  'area', 
  'base', 
  'br', 
  'col', 
  'embed', 
  'hr', 
  'img', 
  'input', 
  'keygen', 
  'link',
  'menuitem', 
  'meta', 
  'param', 
  'source', 
  'track', 
  'wbr'
]

function getRawEndTag (name) {
  if (name === 'style') {
    return STYLE_RAW
  }

  if (name === 'script') {
    return SCRIPT_RAW
  }


  if (name === 'textarea') {
    return TEXTARE_RAW
  }
}

function isVoidElement(name) {
  return VOID_ELEMENTS.includes(name)
}

/**
 *
 * Html string tokenize
 * @example
 * let { doms } = new Tokenize('<div></div>') 
 */
class Tokenize {
  /**
   * @param {string} str Html code
   */
  constructor (str) {
    this.str = str
    this.doms = []
    this.scan()
  }

  scan () {
    while (this.str) {
      this.trimLeft()

      if (this.rawTag()) {
        continue
      }

      if (this.openTag()) {
        continue
      }

      if (this.closeTag()) {
        continue
      }

      if (this.comment()) {
        continue
      }

      this.text()
    }
  }
  /**
   * match content step by step
   * @example
   * this.match(/^<([\w-]+)/)
   */
  match (reg) {
    let match = this.str.match(reg)

    if (!match) {
      return false
    }

    this.str = this.str.slice(match[0].length)

    return match
  }

  trimLeft () {
    let match = this.match(WHITESPACE)

    if (!match) return false

    this.doms.push({
      type: 'text',
      data: match[0]
    })

    return true
  }

  /**
   * match like: <script>, <style>, <textarea>
   */
  rawTag () {
    let match = this.match(RAW_TAG)

    if (!match) return false


    let attributes = this.match(OPEN_TAG_CLOSE)

    if (!attributes) return

    let name =  match[1]  
    let endTag = getRawEndTag(name)

    let content = this.match(endTag)

    if (content) {
      content = content[1]
    }  else {
      content = this.str
      this.str = ''
    }

    let item = {
      type: 'rawTag',
      name,
      attributes: attributes[0].slice(0, -1),
      textContent: content
    }

    this.doms.push(item)

    return true    
  }

  /**
   * match like: <div>,  <input>, ...
   */
  openTag () {
    let match = this.match(OPEN_TAG)

    if (!match) return false

    let attributes = this.match(OPEN_TAG_CLOSE)

    if (!attributes) return false

    attributes = attributes[0].slice(0, -1).trim()

    let isSelfClosing = attributes.endsWith('/')

    if (isSelfClosing) {
      attributes = attributes.slice(0, -1)
    }

    let name = match[1]
    let type

    if (isSelfClosing) {
      type = 'selfClosingTag'
    } else {
      type = isVoidElement(name) ? 'voidTag' : 'openTag'
    }

    let item = {
      type,
      name,
      attributes
    }

    this.doms.push(item) 

    return true
  }

  /**
   * match like: </div>, </title>
   */
  closeTag () {
    let match = this.match(CLOSE_TAG)

    if (!match) return false

    // if this is avoid tag, return statement 
    let name =  match[1]

    if (isVoidElement(name)) return false

    let item = {
      type: 'closeTag',
      name
    }  

    this.doms.push(item)

    return true
  }

  comment () {
    let match = this.match(COMMENT)

    if (!match) return false

    let item = {
      type: 'comment',
      data: match[1]
    }  

    this.doms.push(item)

    return true
  }
  /**
   * match text node
   */
  text () {
    let match = this.match(TEXT)
    let data

    if (match) {
      data = match[0]
    } else if (this.str[0] === '<') {
      data = '<'
      this.str = this.str.slice(1)
    } else {
      return false
    }

    let doms = this.doms

    let last = doms[doms.length - 1]

    if (last && last.type === 'text') {
      last.data += data
      return
    } 

     doms.push({
      type: 'text',
      data
    })
  }
}

module.exports = Tokenize
},{}],10:[function(require,module,exports){
/**
 * options.removeAttributeQuotes
 * value must not contain ['"><\s=`]
 */
const { uglifyAttributesCode } = require('./node.op')


function uglifyOuterHTML({
  name,
  type,
  tagType,
  children,
  attributes,
  data,
  textContent
}, options) {
  let code = []

  switch (type) {
    case 'tag':
      code.push(`<${name}${uglifyAttributesCode(name, attributes, options.removeAttributeQuotes)}`)

      if (tagType === 'selfClosingTag') {
        // <img src="" />
        code.push('/>')
      } else if (tagType === 'voidTag') {
        // <br>
        code.push('>')
      } else {
        code.push('>')

        if (tagType === 'rawTag') {
          code.push(textContent.trim())
        } else {
          for (let item of children) {
            code.push(uglifyOuterHTML(item, options))
          }
        }

        code.push(`</${name}>`)
      }

      break
    case 'text':
      code.push(data.trim())
      break
  }

  return code.join('')
}


module.exports = uglifyOuterHTML
},{"./node.op":6}],11:[function(require,module,exports){
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
},{}]},{},[1])(1)
});
