/**
 * options.removeAttributeQuotes
 * value must not contain ['"><\s=`]
 */
const SPECIAL_ATTR_VALUE = /['"><\s=`]/
const DOUBLE_QUOTES = /"/g

function isScriptOrStyle (name, type) {
  let isScript = name === 'script' && type === 'text/javascript'
  let isStyle =  name === 'style' && type === 'text/css'

  return isScript || isStyle
}

function getAttributesCode(name, attributes, removeAttributeQuotes) {
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
      code.push(`<${name}${getAttributesCode(name, attributes, options.removeAttributeQuotes)}`)

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