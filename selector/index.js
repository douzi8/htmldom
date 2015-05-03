var css = require('./css');
var util = require('utils-extend');
var CLS_REG = /\s+/;
var style = require('./style');
var _private = require('./private');

function $(selector, doc) {
  if (!(this instanceof $)) {
    return new $(selector, doc);
  }

  this.document = doc;
  var i;

  if (util.isString(selector)) {
    var result = this.oneByOne(css.split(selector));

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
  var result = $(selector, ctx);

  this.resetContext(ctx);
  return result;
};

/**
 * $('').parent();
 * $('').parent('.cls')
 */
$.prototype.parent = function(selector) {
  var result = [];
  selector = css.parser(selector || '');

  for (var i = 0; i < this.length; i++) {
    var parent = this[i].parent;

    if (parent && css.match(parent, selector)) {
      result.push(parent);
    }
  }

  return $(result, this.document);
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
  return $(this[index], this.document);
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
    } else if (css.match(this[i], css.parser(selector))) {
      result.push(this[i]);
    }
  }

  return $(result, this.document);
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
          i = i.toLowerCase();
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
        key = key.toLowerCase();
        return this[0].attributes[key];
      } else {
        return undefined;
      }
    }
  } else {
    key = key.toLowerCase();
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
 * $('').remove()
 */
$.prototype.remove = function() {
  for (var i = 0, l = this.length; i < l; i++) {
    var item = this[i];
    var parent = item.parent || this.document;
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
  var result;
  if (util.isUndefined(value)) {
    if (util.isObject(property)) {
      result = style.parser(this[0].attributes.style);
      util.extend(result, property);

      for (var i in result) {
        if (result[i] === null || result[i] === '') {
          delete result[i];
        }
      }

      this[0].attributes.style = style.stringify(result);
    } else {
      if (this.length) {
        result = style.parser(this[0].attributes.style);
        return result[property];
      }
    }
  } else {
    if (this.length) {
      result = style.parser(this[0].attributes.style);
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
$.prototype.hasClass = function(name) {
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
};

$.prototype.addClass = function(name) {
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

$.prototype.removeClass = function(name) {
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
};

/**
 * @example
 * $('').html()                // get
 * $('').html('<div></div>')   // set
 */
$.prototype.html = function(content) {
  if (util.isUndefined(content)) {
    if (this.length) {
      var HtmlDom = require('../htmldom');
      var htmldom = new HtmlDom();
      return htmldom.html(this[0].children);
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
  this.createdom(content, function(item, children) {
    children.forEach(function(child) {
      child.parent = item;
      item.children.push(child);
    });  
  });

  return this;
};

/**
 * $('').prepend('<h2>')
 */
$.prototype.prepend = function(content) {
  this.createdom(content, function(item, children) {
    length = children.length;
    while (length--) {
      var child = children[length];
      child.parent = item;
      item.children.unshift(child);
    }
  });
};

module.exports = $;