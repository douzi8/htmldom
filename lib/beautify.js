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
      result += `<!-- ${item.value} -->`
      continue
    }

    result += item.value.trim()
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
  value
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
          code.push(beautifyRawTag(name, value, newline))
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
      code.push(beautifyText(value, newline))
      break
    case 'comment':
      code.push(`${newline}<!--${value}-->`)
      break
  }

  return code.join('')
}


module.exports = beautifyOuterHTML