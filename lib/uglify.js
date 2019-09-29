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
  value
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
          code.push(value.trim())
        } else {
          for (let item of children) {
            code.push(uglifyOuterHTML(item, options))
          }
        }

        code.push(`</${name}>`)
      }

      break
    case 'text':
      code.push(value.trim())
      break
  }

  return code.join('')
}


module.exports = uglifyOuterHTML