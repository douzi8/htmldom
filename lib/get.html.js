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

  // script, style, textarea
  if (node.tagType === 'rawTag') {
    return node.textContent
  }

  for (let i = 0; i < children.length; i++) {
    html += getOuterHTML(children[i])
  }

  return html
}

module.exports = {
  getOuterHTML,
  getHtml
}