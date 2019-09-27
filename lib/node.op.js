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
  }

  nodeClassList(result)
  
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


module.exports = {
  updateAttrValue,
  cloneNode,
  nodeClassList
}