var EL = require('./elements');

function Parser(dom) {
  this.dom = dom;
  this.backup = [];
  this.start();
}

Parser.prototype.updatePos = function() {
  this.backup = this.dom.shift();
}

Parser.prototype.restore = function(count) {
  this.dom.unshift(this.backup);
}

Parser.prototype.start = function(dom) {
  var result = [];
  var item;

  while (this.dom.length) {
    item = this.dom[0];

    switch (item.type) {
      case 'documentType':
      case 'text':
      case 'comment':
        result.push(item);
        break;
      case 'voidtag':
        item.type = 'tag';
        item.children = [];
        result.push(item);
        break;
      case 'opentag':
        item.children = this.recurse(item.name);
        item.type = 'tag';
        result.push(item);
    }

    this.updatePos();
  }
  
  this.result = result;
}

Parser.prototype.recurse = function(name) {
  var result = [];
  var open = name;
  var item, optional;

  while (this.dom.length && open) {
    this.updatePos();
    item = this.dom[0];
    if (!item) return result;

    switch (item.type) {
      case 'text':
      case 'comment':
        result.push(item);
        break;
      case 'voidtag':
        item.type = 'tag';
        item.children = [];
        result.push(item);
        break;
      case 'opentag':
        // 缺省标签
        optional = EL.OPTIONAL_TAGS[open];
        if (optional && optional.indexOf(item.name) !== -1) {
          open = '';
          this.restore();
        } else {
          item.type = 'tag';
          item.children = this.recurse(item.name);
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

Parser.prototype.stringify = function() {
  
} 
module.exports = Parser;