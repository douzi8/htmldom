const { isNull } = require('./util')


function updateAttrValue (node, key, value) {
  if (isNull(value)) {
    delete node.attributes[key]
    return
  }

  node.attributes[key] = value + ''
}

function cloneNode (node, parent) {
  if (!parent) parent = null

  let result = {
    ...node,
    parent
  }


  if (node.children) {
    let children = []
    
    node.children.forEach(item => {
      children.push(cloneNode(item, result))
    })

    result.children = children
  }

  if (node.attributes) {
    result.attributes = {
      ...node.attributes
    }

    nodeClassList(result)
    nodeStyle(result)
  }

  
  return result
}

function nodeClassList (node) {
  if (node.type !== 'tag') return

  Object.defineProperty(node, 'classList', {
    get () {
      let className = this.attributes.class

      let classList = className ? className.split(/\s+/) : []

      return new Set(classList)
    },

    set (value) {
      let result = [...value]

      if (result.length) {
        this.attributes.class = result.join(' ')
      } else {
        delete this.attributes.class
      }
    }
  })
}

const SEMICOLON =  /\s*;\s*/

/**
 * Set or get node's style
 * @example
 * node.style  => {}
 * node.style = { color: 'value '}
 */
function nodeStyle (node) {
  if (node.type !== 'tag') return

  Object.defineProperty(node, 'style', {
    get () {
      let style = this.attributes.style
      let result = {}

      if (!style) return result

      style = style.split(SEMICOLON)

      for (let item of style) {
         let index = item.indexOf(':')

        if (index !== -1) {
          let key = item.slice(0, index).trim()
          let value = item.slice(index + 1).trim()

          result[key] = value
        }
      }

      return result
    },
    set (obj) {
      if (!obj) {
        delete this.attributes.style
        return
      }

      let style = []

      for (let key in obj) {
        let value = obj[key]

        if (!isNull(value)) {
          style.push(`${key}:${value}`)
        }
      }

      if (style.length) {
        this.attributes.style = style.join(';')
      } else {
        delete this.attributes.style
      }
      
    }
  })
}


module.exports = {
  updateAttrValue,
  cloneNode,
  nodeClassList,
  nodeStyle
}