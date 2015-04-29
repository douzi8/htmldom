var cssSelector = require('./css-selector');
var util = require('utils-extend');
var cssMatch = require('./css-match');
var CLS_REG = /\s+/;
var style = require('./style');

function Selector(selector, root) {
  if (util.isString(selector)) {
    this.length = 0;
    selector = cssSelector.split(selector);
    this._search(selector.shift(), root);
    // found child node by check parent
    if (selector.length) {
      var child = this;
      for (var i = 0; i < selector.length; i++) {
        child = child.find(selector[i]);
      }
      return child;
    }
  } else {
    if (!util.isArray(selector)) {
      selector = [selector];
    }

    for (var i = 0; i < selector.length; i++) {
      this[i] = selector[i];
    }
    
    this.length = selector.length;
  }
}

Selector.prototype._search = function(selector, root) {
  var self = this;
  selector = cssSelector.parser(selector);
  
  function recurse(item) {
    if (item.type !== 'tag') return false;
    if (cssMatch(item, selector)) {
      self[self.length++] = item;
    }

    for (var i = 0, l = item.children.length; i < l; i++) {
      recurse(item.children[i]);
    }
  }

  for (var i = 0, l = root.length; i < l; i++) {
    recurse(root[i]);
  }
};

Selector.prototype._keepParent = function() {
  var root = [];
  var parent;

  for (var i = 0; i < this.length; i++) {
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

  return root;
};

/**
 * @example
 * $('').eq(0)
 * $('').eq(-1)
 */
Selector.prototype.eq = function(index) {
  if (index < 0) {
    index += this.length;
  }
  return new Selector(this[index]);
}

/**
 * @example
 * $('').filter('[data-id=1]')
 * $('').filter(function(index) {});
 */
Selector.prototype.filter = function(selector) {
  var result = [];
  var isFunction = util.isFunction(selector);

  for (var i = 0; i < this.length; i++) {
    if (isFunction) {
      if (selector.call(this, i)) {
        result.push(this[i]);
      }
    } else if (cssMatch(this[i], cssSelector.parser(selector))) {
      result.push(this[i]);
    }
  }

  return new Selector(result);
}

/**
 * @example
 * $('').find('a');
 */
Selector.prototype.find = function(selector) {
  var els = this._keepParent();
  var result;

  if (els.length) {
    // filter parent
    result = els.reduce(function(pre, current,index) {
      if (index === 0) {
        return current.children;
      } else {
        return pre.concat(current.children);
      }
    }, true);
  }  else {
    result = [];
  }

  return new Selector(selector, result);
};

Selector.prototype.each = function(callback) {
  for (var i = 0; i < this.length; i++) {
    callback.call(this, i, this[i]);
  }
}

/**
 * get or set attributes
 * @example
 * dom.attr('key', 'value');
 * dom.attr('key', null);  // remove attr
 * dom.attr({
 * 
 * });
 */
Selector.prototype.attr = function(key, value) {
  if (util.isUndefined(value)) {
    if (util.isObject(key)) {
      this.each(function(index, item) {
        for (var i in key) {
          if (key[i] === null) {
            delete item.attributes[i];
          } else {
            var value = key[i] + '';
            item.attributes[i] = value;
          }
        }
      });
    } else {
      if (this.length) {
        return this[0].attributes[key];
      } else {
        return undefined;
      }
    }
  } else {
    this.each(function(index, item) {
      if (value === null) {
        delete item.attributes[key];
      } else {
        value += '';
        item.attributes[key] = value;
      }
    });
  }

  return this;
};

/**
 * @example
 * $('').html()                // get
 * $('').html('<div></div>')   // set
 */
Selector.prototype.html = function(html) {
  var HtmlDom = require('../htmldom');
  if (util.isUndefined(html)) {
    if (this.length) {
      var htmldom = new HtmlDom();
      return htmldom.html(this[0].children);
    } else {
      return null;
    }
  } else {
    this.each(function(index, item) {
      var htmldom = new HtmlDom(html);
      htmldom.dom.forEach(function(child) {
        child.parent = item;
      });
      item.children = htmldom.dom;
    });
  }

  return this;
};

/**
 * @example
 * $('').remove()
 */
Selector.prototype.remove = function() {
  var els = this._keepParent();

  for (var i = 0, l = els.length; i < l; i++) {
    var item = els[i];
    var parent = item.parent || this._document;
    var children = parent.children || parent;

    for (var j = 0; j < children.length; j++) {
      if (children[j] === item) {
        break;
      }
    }

    children.splice(j, 1);
  }

  return this;
};

Selector.prototype.css = function(property, value) {
  if (util.isUndefined(value)) {
    if (util.isObject(property)) {
      var result = style.parser(this[0].attributes.style);
      util.extend(result, property);

      for (var i in result) {
        if (result[i] === null || result[i] === '') {
          delete result[i];
        }
      }

      this[0].attributes.style = style.stringify(result);
    } else {
      if (this.length) {
        var result = style.parser(this[0].attributes.style);
        return result[property];
      }
    }
  } else {
    if (this.length) {
      var result = style.parser(this[0].attributes.style);
      if (value === null || value === '') {
        delete result[property];
      } else {
        result[property] = value;
      }
      this[0].attributes.style = style.stringify(result);
    }
  }
  return this;
};

/**
 * @example
 * $('').hasClass('cls');
 * $('').hasClass('cls1 cls2');
 */
Selector.prototype.hasClass = function(name) {
  if (!name) return false;
  var has = false;
  name = name.split(CLS_REG);

  for (var i = 0; i < this.length; i++) {
    var cls = this[i].attributes.class;

    if (cls) {
      cls = cls.split(CLS_REG);
      var length = name.length;

      while (length--) {
        if (cls.indexOf(name[length]) === -1) {
          has = false;
          break;
        }
        has = true;
      }

      if (has) {
        break;
      }
    }
  }

  return has;
}

Selector.prototype.addClass = function(name) {
  name = name.split(CLS_REG);
  this.each(function(index, item) {
    for (var i = 0; i < name.length; i ++) {
      var cls = item.attributes.class;

      if (cls) {
        cls = cls.split(CLS_REG);
        if (cls.indexOf(name[i]) === -1) {
          cls.push(name[i]);
        }
        item.attributes.class = cls.join(' ');
      } else {
        item.attributes.class = name[i];
      }
    }
  });
  return this;
};

Selector.prototype.removeClass = function(name) {
  var removeAll = util.isUndefined(name) ? true : false;
  if (!removeAll) {
    name = name.split(CLS_REG);
  }
  
  this.each(function(index, item) {
    if (removeAll) {
      delete item.attributes.class;
    } else {
      for (var i = 0; i < name.length; i ++) {
        var cls = item.attributes.class;

        if (cls) {
          cls = cls.split(CLS_REG);
          cls = cls.filter(function(item) {
             return item !== name[i];
          });
          if (cls.length) {
            item.attributes.class = cls.join(' ');
          } else {
            delete item.attributes.class;
          }
        }
      }
    }
  });
  return this;
}

module.exports = Selector;