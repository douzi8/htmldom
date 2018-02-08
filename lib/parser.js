var CHILD = require('./elements').CHILD;
var OPTIONAL_TAGS = require('./elements').OPTIONAL_TAGS;

function Parser(dom) {
  this.dom = dom;
  this.start();
}

Parser.prototype.updatePos = function() {
  this.backup = this.dom.shift();
};

Parser.prototype.restore = function() {
  this.dom.unshift(this.backup);
};

Parser.prototype.start = function(dom) {
  var result = [];
  var item;

  while (this.dom.length) {
    item = this.dom[0];
    item.parent = null;

    switch (item.type) {
      case 'documentType':
      case 'text':
      case 'comment':
        result.push(item);
        break;
      case 'voidtag':
        item.type = 'tag';
        item.isVoid = true
        item.children = [];

        result.push(item);
        break;
      case 'opentag':
        item.children = this.recurse(item);
        item.type = 'tag';
        result.push(item);
    }

    this.updatePos();
  }
  
  // Set root element
  var length = result.length;
  var doc = {
    attributes: {},
    parent: null,
    children: result
  };

  while (length--) {
    result[length].parent = doc;
  }

  this.dom = doc;
};

Parser.prototype.recurse = function(parent) {
  var result = [];
  var open = parent.name;
  var item, optional;

  while (this.dom.length && open) {
    this.updatePos();
    item = this.dom[0];
    if (!item) return result;
    item.parent = parent;

    switch (item.type) {
      case 'text':
      case 'comment':
        result.push(item);
        break;
      case 'voidtag':
        item.type = 'tag';
        item.children = [];
        item.isVoid = true
        result.push(item);
        break;
      case 'opentag':
        // 缺省标签
        if (this.optionalTag(parent, item)) {
          open = '';
          this.restore();
        // the tag is optional tag
        } else {
          item.type = 'tag';
          item.children = this.recurse(item);
          result.push(item);
        }
        break;
      case 'closetag':
        // 碰到不是关闭自己的标签，需要立马关掉
        if (open != item.name) {
          this.restore();
          return result;
        } else {
          open = '';
        }
    }
  }

  return result;
};

/**
 * @example
 * <li>
 * <li>
 * ------
 * <li>
 *   <div>
 * <li>
 * -------
 * <dt>
 *   <div>   
 * <dd>
 */
Parser.prototype.optionalTag = function(prev, current) {
  while (prev) {
    var parent = CHILD[prev.name];
    // fixed <ul><li><ul><li></li><div><li></li></div></ul></li></ul> bug
    if (parent && parent.indexOf(current.name) !== -1) {
      return false;
    }

    var optional = OPTIONAL_TAGS[prev.name];
    if (optional && optional.indexOf(current.name) !== -1) {
      return true;
    }

    prev = prev.parent;
  }

  return false;
};

module.exports = Parser;