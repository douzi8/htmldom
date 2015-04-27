var cssSelector = require('./css-selector');
var util = require('utils-extend');
var cssMatch = require('./css-match');

function filterSelector(selector) {
  selector = selector.replace(/('[^]*'|"[^]*")/g, function(match) {
    return match.replace(/\s/g, '%20');
  });

  return /\s+/.test(selector);
}

function Selector(selector, document) {
  this.document = document;
  if (filterSelector(selector)) {
    throw new Error('Not support child selector now');
  }
  this.selector = cssSelector(selector);
  this.length = 0;
  this._search();
}

Selector.prototype._search = function() {
  var self = this;
  var selector = this.selector;

  function recurse(item) {
    if (item.type !== 'tag') return false;
    if (cssMatch(item, selector)) {
      self[self.length++] = item;
    }

    for (var i = 0, l = item.children.length; i < l; i++) {
      recurse(item.children[i]);
    }
  }

  for (var i = 0, l = this.document.length; i < l; i++) {
    recurse(this.document[i]);
  }
};

Selector.prototype.each = function(callback) {
  for (var i = 0; i < this.length; i++) {
    callback(i, this[i]);
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
            item.attributes[i] = key[i];
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
        item.attributes[key] = value;
      }
    });
  }

  return this;
};


Selector.prototype.html = function() {

};

Selector.prototype.addClass = function() {

};

Selector.prototype.removeClass = function() {

}

module.exports = Selector;