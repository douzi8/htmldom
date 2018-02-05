var css = require('./css');
var util = require('utils-extend');
var REG = require('./reg');
var style = require('./style');
var _private = require('./private');

function $(selector, doc) {
  if (!(this instanceof $)) {
    return new $(selector, doc);
  }
  var i;

  if (util.isString(selector)) {
    var result = this.oneByOne(selector, doc);

    for (i = 0; i < result.length; i++) {
      delete result[i]._searchNode;
      this[i] = result[i];     
    }

    this.length = result.length;
  } else {
    if (!util.isArray(selector)) {
      selector = [selector];
    }

    for (i = 0; i < selector.length; i++) {
      this[i] = selector[i];
    }
    
    this.length = selector.length;
  }
}

_private($.prototype);

/**
 * $('div').find('.item > a')
 */
$.prototype.find = function(selector) {
  var ctx = this.newContext();
  return $(selector, ctx);
};

/**
 * $('').parent();
 * $('').parent('.cls')
 */
$.prototype.parent = function(selector) {
  var result = [];
  if (selector) {
    selector = css.parser(selector)[0];
  }

  for (var i = 0; i < this.length; i++) {
    var parent = this[i].parent;

    if (parent) {
      if (selector) {
        if (css.match(parent, selector)) {
          result.push(parent);
        }
      } else {
        result.push(parent);
      }
    }
  }

  return $(result);
};

/**
 * @example
 * $('').eq(0)
 * $('').eq(-1)
 */
$.prototype.eq = function(index) {
  if (index < 0) {
    index += this.length;
  }
  return $(this[index]);
};

/**
 * @example
 * $('').filter('[data-id=1]')
 * $('').filter(function(index) {});
 */
$.prototype.filter = function(selector) {
  var result = [];
  var isFunction = util.isFunction(selector);

  for (var i = 0; i < this.length; i++) {
    if (isFunction) {
      if (selector.call(this, i)) {
        result.push(this[i]);
      }
    } else if (css.match(this[i], css.parser(selector)[0])) {
      result.push(this[i]);
    }
  }

  return $(result);
};

$.prototype.each = function(callback) {
  for (var i = 0; i < this.length; i++) {
    callback.call(this, i, this[i]);
  }
};

/**
 * get or set attributes
 * @example
 * dom.attr('key', 'value');
 * dom.attr('key', null);  // remove attr
 * dom.attr({
 * 
 * });
 */
$.prototype.attr = function(key, value) {
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
      } else if (util.isFunction(value)) {
        item.attributes[key] = value(index, item.attributes[key]);
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
 * $('').data('value')
 */
$.prototype.data = function(name, value) {
  var attrName = 'data-' + name.replace(REG.CAPTIAL, '-$1').toLowerCase();

  if (util.isUndefined(value)) {
    value = this.attr(attrName);

    switch (value) {
      case 'true':
        return true;
      case 'false':
        return false;
      case 'null':
        return null;
      default:
        if (REG.OBJECT.test(value)) {
          try {
            value = JSON.parse(value);
          } catch (e) {}
        } else if (REG.NUMBER.test(value)) {
          value = parseInt(value, 10);
        }

        return value; 
    }
  } else {
    this.attr(attrName, value);
    return this;
  }
};

/**
 * @example
 * $('').remove()
 */
$.prototype.remove = function() {
  for (var i = 0, l = this.length; i < l; i++) {
    var item = this[i];
    var parent = item.parent;
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

$.prototype.css = function(property, value) {
  var result, i;

  function set(item, obj) {
    var ret = style.parser(item.attributes.style);
    util.extend(ret, obj);

    for (var i in ret) {
      if (ret[i] === null) {
        delete ret[i];
      }
    }

    item.attributes.style = style.stringify(ret);
  }

  if (util.isUndefined(value)) {
    if (util.isObject(property)) {
      for (i = 0; i < this.length; i++) {
        set(this[i], property);
      }
    } else if (this.length) {
      result = style.parser(this[0].attributes.style);
      return result[property];
    } else {
      return null;
    }
  } else {
    for (i = 0; i < this.length; i++) {
      var obj = {};
      obj[property] = value;
      set(this[i], obj);
    }
  }

  return this;
};

/**
 * @example
 * $('').hasClass('cls');
 * $('').hasClass('cls1 cls2');
 */
$.prototype.hasClass = function(name) {
  if (!name) return false;
  var has = false;
  name = name.split(REG.CLASS_SPLIT);

  for (var i = 0; i < this.length; i++) {
    var cls = this[i].attributes.class;

    if (cls) {
      cls = cls.split(REG.CLASS_SPLIT);
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
};

$.prototype.addClass = function(name) {
  name = name.split(REG.CLASS_SPLIT);
  this.each(function(index, item) {
    for (var i = 0; i < name.length; i ++) {
      var cls = item.attributes.class;

      if (cls) {
        cls = cls.split(REG.CLASS_SPLIT);
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

$.prototype.removeClass = function(name) {
  var removeAll = util.isUndefined(name) ? true : false;
  if (!removeAll) {
    name = name.split(REG.CLASS_SPLIT);
  }
  
  this.each(function(index, item) {
    if (removeAll) {
      delete item.attributes.class;
    } else {
      for (var i = 0; i < name.length; i ++) {
        var cls = item.attributes.class;

        if (cls) {
          cls = cls.split(REG.CLASS_SPLIT);
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
};

/**
 * @example
 * $('').html()                // get
 * $('').html('<div></div>')   // set
 */
$.prototype.html = function(content) {
  if (util.isUndefined(content)) {
    if (this.length) {
      return this.getHtml(this[0]);
    } else {
      return null;
    }
  } else {
    this.createdom(content, function(item, children) {
      children.forEach(function(child) {
        child.parent = item;
      });
      item.children = children;
    });
  }

  return this;
};

/**
 * $('').append('<ul><li>1');
 */
$.prototype.append = function(content) {
  return this.createdom(content, function(item, children) {
    this.insertChild(item, item.children.length, children);
  });
};

/**
 * $('').prepend('<h2>')
 */
$.prototype.prepend = function(content) {
  return this.createdom(content, function(item, children) {
    this.insertChild(item, 0, children);
  });
};

/**
 * $('').after('<li>')
 */
$.prototype.after = function(content) {
  return this.createdom(content, function(item, children) {
    var parent = item.parent;
    this.insertChild(parent, parent.children.indexOf(item) + 1, children);
  });
};

$.prototype.before = function(content) {
  return this.createdom(content, function(item, children) {
    var parent = item.parent;
    this.insertChild(parent, parent.children.indexOf(item), children);
  });
};

module.exports = $;