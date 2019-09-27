const DOUBLE_QUOTES = /"/g

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
  value
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

          code.push(value)
        } else {
          for (let item of children) {
            code.push(getOuterHTML(item))
          }
        }

        code.push(`</${name}>`)
      }

      break
    case 'text':
      code.push(value)
      break
    case 'comment':
      code.push(`<!--${value}-->`)
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