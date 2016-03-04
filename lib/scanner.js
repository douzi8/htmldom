var REG = require('./reg');
var VOID_ELEMENTS = require('./elements').VOID_ELEMENTS;

function HtmlScanner(str, escape) {
  this.str = str.trimRight();
  this.escape = escape;
  this.dom = [];
  this.scanner();
}

HtmlScanner.prototype.scanner = function() {
  this.documentType();

  while (this.str) {
    if (this.comment()) {
      continue;
    }

    if (this.opentag()) {
      continue;
    }

    if (this.closetag()) {
      continue;
    }

    this.text();
  }
};

// match and update position
HtmlScanner.prototype.match = function(reg) {
  var match = this.str.match(reg);

  if (!match) {
    return false;
  }

  this.str = this.str.slice(match[0].length);
  return match;
};

// match comment
HtmlScanner.prototype.comment = function() {
  var match = this.match(REG.COMMENT_START);
  var value;

  if (match) {
    match = this.match(REG.COMMENT_END);

    if (match) {
      value = match[1];
    } else {
      value = this.str;
      this.str = '';
    }

    this.dom.push({
      type: 'comment',
      value: value,
      isIEHack: value.slice(value.length- REG.IE_HACK.length) === REG.IE_HACK
    });

    return true;
  } else {
    return false;
  }
};

// DOCTYPE Declaration
HtmlScanner.prototype.documentType = function() {
  while (this.str) {
    this.match(REG.WHITESPACE);

    if (this.comment()) {
      continue;
    }

    var match = this.match(REG.DOCTYPE);

    if (match) {
      this.dom.push({
        type: 'documentType',
        value: match[0]
      });
    }
    return;
  }
};

HtmlScanner.prototype.attrs = function(name) {
  var match = this.match(REG.TAG_CONTENT);
  var self = this;

  if (this.str[0] === '>') {
    this.str = this.str.slice(1);
    var attrs = {};
    var count = 0;

    /**
     * attributes syntax
     * @example
     * Empty attribute: <input disabled>
     * Unquoted attribute value: <input value=yes>
     * Single-quoted attribute value: <input type='checkbox'>
     * Double-quoted attribute value: <input name="be evil">
     */
    match[0].replace(REG.ATTR, function(match, key, value) {
      if (!self.isServerCode(key)) {
        key = key.toLowerCase();
      }

      if (attrs.hasOwnProperty(key)) {
        key += '__' + count++;
      }

      value = value ? value.replace(REG.TRIM_QUOTES, '') : null;
      attrs[key] = value;
    });
    var dom = {
      name: name.toLowerCase(),
      attributes: attrs
    };

    if (VOID_ELEMENTS.indexOf(dom.name) !== -1) {
      dom.type = 'voidtag';
    } else {
      dom.type = 'opentag';
    }

    this.dom.push(dom);
  }
};

// Match open tag
HtmlScanner.prototype.opentag = function() {
  var match = this.match(REG.RAW_TAG);

  if (match) {
    var name = match[1];
    this.attrs(name);
    match = this.match(REG.RAW_TAG_END(name));

    if (match) {
      match = match[0];
    } else {
      match = this.str;
      this.str = '';
    }

    this.dom.push({
      type: 'text',
      value: match
    });
    return true;
  } else if (match = this.match(REG.OPEN_TAG)) {
    this.attrs(match[1]);
    return true;
  } else {
    return false;
  }
};

HtmlScanner.prototype.closetag = function() {
  var match = this.match(/^<\/([\w\s]+)>/);

  if (match) {
    var tagname = match[1];

    this.dom.push({
      type: 'closetag',
      name: tagname.toLowerCase()
    });
    return true;
  } else {
    return false;
  }
};

HtmlScanner.prototype.text = function() {
  var match = this.match(REG.WHITESPACE);
  var value;
  if (match) {
    value = match[0];
  } else {
    value = this.str[0];
    this.str = this.str.slice(1);
  }
  var last = this.dom[this.dom.length - 1];

  if (last) {
    if (last.type === 'text') {
      last.value += value;
    } else {
      this.dom.push({
        type: 'text',
        value: value
      });
    }
  } else {
    this.dom = [{
      type: 'text',
      value: value
    }];
  }
};

HtmlScanner.prototype.isServerCode = function(code) {
  for (var i = 0; i < this.escape.length; i++) {
    var reg = new RegExp(this.escape[i]);
    if (reg.test(code)) {
      return true;
    }
  }

  return false;
};

module.exports = HtmlScanner;