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
const COMMENT = /^<!--([\s\S]*)-->/
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
      value: match[0]
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
      value: content
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
      value: match[1]
    }  

    this.doms.push(item)

    return true
  }
  /**
   * match text node
   */
  text () {
    let match = this.match(TEXT)
    let value

    if (match) {
      value = match[0]
    } else if (this.str[0] === '<') {
      value = '<'
      this.str = this.str.slice(1)
    } else {
      return false
    }

    let doms = this.doms

    let last = doms[doms.length - 1]

    if (last && last.type === 'text') {
      last.value += value
      return
    } 

     doms.push({
      type: 'text',
      value
    })
  }
}

module.exports = Tokenize