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