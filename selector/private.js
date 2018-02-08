var css = require('./css');
var REG = require('../lib/reg');
var elements = require('../lib/elements')

function _private(fn) {
  for (var i in _private) {
    Object.defineProperty(fn, i, {
      enumerable: false,
      writable: false,
      value: _private[i]
    });
  }
}

_private.oneByOne = function(selector, doc) {
  selector = css.parser(selector);
  var result = this.search(selector.shift(), doc);

  while (selector.length) {
    var item = selector.shift();

    switch (item.operator) {
      case '>':
        result = this.matchDirectParent(item, result, doc);
        break;
      case '+':
        result = this.matchNextWithBrother(item, result);
        break;
      case '~':
        result = this.matchPrecededByBrother(item, result);
        break;
      default:
        result = this.matchParent(item, result, doc);
    }
  }

  return result;
};

// find all child first
_private.search = function(selector, nodes) {
  var result = [];

  for (var i = 0, l = nodes.length; i < l; i++) {
    var item = nodes[i];
    if (item.type === 'tag') {
      if (css.match(item, selector)) {
        result.push(item);
      }
      result = result.concat(this.search(selector, item.children));
    }
  }

  return result;
};

/**
 * @example
 * $('div a')
 */
_private.matchParent = function(selector, nodes, doc) {
  var result = [];

  for (var i = 0, l = nodes.length; i < l; i++) {
    var searchNode = nodes[i]._searchNode || nodes[i];
    var match = false;

    while (doc.indexOf(searchNode) === -1 && searchNode) {
      var parent = searchNode.parent;
      if (css.match(parent, selector)) {
        result.push(nodes[i]);
        nodes[i]._searchNode = parent;
        match = true;
        break;
      }
      searchNode = parent;
    }

    if (!match) {
      delete nodes[i]._searchNode;
    }
  }

  return result;
};

/**
 * @example
 * $('div > a')
 */
_private.matchDirectParent = function(selector, nodes, doc) {
  var result = [];

  for (var i = 0, l = nodes.length; i < l; i++) {
    var searchNode = nodes[i]._searchNode || nodes[i];

    if (doc.indexOf(searchNode) === -1 && css.match(searchNode.parent, selector)) {
      result.push(nodes[i]);
      nodes[i]._searchNode = searchNode.parent;
    } else {
      delete nodes[i]._searchNode;
    }
  }

  return result;
};

/**
 * @example
 * $('div + p')
 */
_private.matchNextWithBrother = function(selector, nodes) {
  var result = [];

  function preceded(brother, node) {
    for (var i = 0; i < brother.length; i++) {
      if (brother[i] === node) {
        break;
      }
    }

    while (i--) {
      var item = brother[i];

      if (item.type === 'tag') {
        return item;
      }
    }
  }

  for (var i = 0, l = nodes.length; i < l; i++) {
    var searchNode = nodes[i]._searchNode || nodes[i];
    var brother = searchNode.parent.children;
    var pre = preceded(brother, searchNode);

    if (pre && css.match(pre, selector)) {
      result.push(nodes[i]);
      nodes[i]._searchNode = pre;
    } else {
      delete nodes[i]._searchNode;
    }
  }

  return result;
};
/**
 * @example 
 * $('div ~ p')
 */
_private.matchPrecededByBrother = function(selector, nodes) {
  var result = [];

  function preceded(brother, node) {
    for (var i = 0; i < brother.length; i++) {
      if (brother[i] === node) {
        break;
      }
    }
    
    return brother.slice(0, i);
  }

  for (var i = 0, l = nodes.length; i < l; i++) {
    var searchNode = nodes[i]._searchNode || nodes[i];
    var brother = searchNode.parent.children;
    var pres = preceded(brother, searchNode);

    if (pres.length) {
      for (var j = 0; j < pres.length; j++) {
        if (css.match(pres[j], selector)) {
          result.push(nodes[i]);
          nodes[i]._searchNode = pres[i];
          break;
        }
      }
    } else {
      delete nodes[i]._searchNode;
    }
  }

  return result;
};

// for find api
_private.newContext = function(dom) {
  var root = [];
  var result = [];

  for (i = 0; i < this.length; i++) {
    var isChild = false;
    parent = this[i].parent;
    while (parent) {
      if (root.indexOf(parent) !== -1) {
        isChild = true;
        break;
      }
      parent = parent.parent;
    }

    if (!isChild) {
      root.push(this[i]);
    }
  }

  result = root.reduce(function(pre, current,index) {
    var children = current.children;
    var result = [];

    for (var i = 0; i < children.length; i++) {
      if (children[i].type === 'tag') {
        result.push(children[i]);
      }
    }

    return pre.concat(result);
  }, result);

  return result;
};

_private.insertChild = function(parent, index, children) {
  var arg = [index, 0];

  for (var i = 0; i < children.length; i++) {
    children[i].parent = parent;
    arg.push(children[i]);
  }

  Array.prototype.splice.apply(parent.children, arg);
};

_private.createdom = function(html, callback) {
  var HtmlDom = require('../htmldom');

  for (var i = 0; i < this.length; i++) {
    var htmldom = new HtmlDom(html).dom;
    callback.call(this, this[i], htmldom.children);
  }
  
  return this;
};

function getHtml(node, options = {}) {
  var html = [];
  var name = node.name;

  switch (node.type) {
    case 'text':
      html.push(node.value);
      break;
    case 'tag':
      html.push('<' + name);
      for (var i in node.attributes) {
        var key = i.replace(REG.ATTR_BUG, '');
        var value = node.attributes[i];
        if (value) {
          html.push(' ' + key + '="' + value.replace(REG.DOUBLE_QUOTES, '&quot;') + '"');
        } else {
          html.push(' ' + key);
        }
      }

      html.push(elements.closeTag(options.selfClosed, node))
      
      if (!node.isVoid) {
        node.children.forEach(function(item) {
          html.push(getHtml(item, options));
        });
        html.push('</' + name + '>');
      }
    break;
    case 'comment':
      html.push('<!--' + node.value + '-->');
      break;
    case 'documentType':
      html.push(node.value);
      break;
  }

  return html.join('');
}

_private.getHtml = function(node, options) {
  var html = '';
  var children = node.children;

  for (var i = 0; i < children.length; i++) {
    html += getHtml(children[i], options);
  }

  return html;
};

module.exports = _private;