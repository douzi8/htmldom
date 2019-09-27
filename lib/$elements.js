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

  addClass () {

  }
}


module.exports = $Elements