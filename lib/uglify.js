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
        /**
         * <img src="" />
         * <link href=https />
         */
         if (options.removeAttributeQuotes) {
          code.push(' ')
         }
         
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