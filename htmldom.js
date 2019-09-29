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
 * $.html()
 * $.beautify()
 * $.uglify()
 *
 */
function createHtmlDom (code) {
  let { nodes } = new HtmlParser(code)

  let htmldom = function (selector) {
    return new $Elements(selector, {
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