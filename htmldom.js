var REG = require('./lib/reg');
var Parser = require('./lib/parser');
var VOID_ELEMENTS = require('./lib/elements').VOID_ELEMENTS;
var $ = require('./selector/index');
var esc = require('./lib/escape');

function HtmlDom(str, escape, _escape) {
  str = (str || '') + '';
  // fixed escape bug
  this._escape = _escape || [];

  if (escape) {
    // Escape server code first
    for (var i = 0; i < escape.length; i++) {
      str = str.replace(escape[i], function(match) {
        return esc.escape(match) + ' ';
      });
      this._escape.push(esc.escape(escape[i].source) + '\\s?');
    }
  }

  this._str = str.trimRight();
  this.dom = [];
  this._scanner();
  /**
   * @example
   * var $ = html.$;
   * $('div').addClass()
   * $('#id').attr('key')
   */
  this.$ = function(selector) {
    return $(selector, this.dom.children);
  }.bind(this);
}

HtmlDom.prototype._scanner = function() {
  this._documentType();

  while (this._str) {
    if (this._comment()) {
      continue;
    }

    if (this._opentag()) {
      continue;
    }

    if (this._closetag()) {
      continue;
    }

    this._text();
  }

  var parser = new Parser(this.dom);
  this.dom = parser.result;
};

// match and update position
HtmlDom.prototype._match = function(reg) {
  var match = this._str.match(reg);

  if (!match) {
    return false;
  }

  this._str = this._str.slice(match[0].length);
  return match;
};

// match comment
HtmlDom.prototype._comment = function() {
  var match = this._match(REG.COMMENT_START);
  var value;

  if (match) {
    match = this._match(REG.COMMENT_END);

    if (match) {
      value = match[1];
    } else {
      value = this._str;
      this._str = '';
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
HtmlDom.prototype._documentType = function() {
  while (this._str) {
    this._match(REG.WHITESPACE);

    if (this._comment()) {
      continue;
    }

    var match = this._match(REG.DOCTYPE);

    if (match) {
      this.dom.push({
        type: 'documentType',
        value: match[0]
      });
    }
    return;
  }
};

HtmlDom.prototype._attrs = function(name) {
  var match = this._match(REG.TAG_CONTENT);
  var self = this;

  if (this._str[0] === '>') {
    this._str = this._str.slice(1);
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
      if (!self._isServerCode(key)) {
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
HtmlDom.prototype._opentag = function() {
  var match = this._match(REG.RAW_TAG);

  if (match) {
    var name = match[1];
    this._attrs(name);
    match = this._match(REG.RAW_TAG_END(name));

    if (match) {
      match = match[0];
    } else {
      match = this._str;
      this._str = '';
    }

    this.dom.push({
      type: 'text',
      value: match
    });
    return true;
  } else if (match = this._match(REG.OPEN_TAG)) {
    this._attrs(match[1]);
    return true;
  } else {
    return false;
  }
};

HtmlDom.prototype._closetag = function() {
  var match = this._match(/^<\/([\w\s]+)>/);

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

HtmlDom.prototype._text = function() {
  var match = this._match(REG.WHITESPACE);
  var value;
  if (match) {
    value = match[0];
  } else {
    value = this._str[0];
    this._str = this._str.slice(1);
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

HtmlDom.prototype._isServerCode = function(code) {
  for (var i = 0; i < this._escape.length; i++) {
    var reg = new RegExp(this._escape[i]);
    if (reg.test(code)) {
      return true;
    }
  }

  return false;
};

HtmlDom.prototype._unescape = function(html, callback) {
  function replace(match) {
    match = esc.unescape(match);
    if (callback) {
      match = callback(match);
    }
    return match.trimRight();
  }

  for (var i = 0; i < this._escape.length; i++) {
    html = html.replace(new RegExp(this._escape[i], 'g'), replace);
  }
  return html;
};

HtmlDom.prototype.html = function() {
  var html = $.prototype.getHtml(this.dom);

  return this._unescape(html);
};

HtmlDom.prototype.stringify = function(opt) {
  opt = opt || {};
  var uglify = require('./uglify/index');
  opt._escape = this._escape;
  var html = uglify(this.dom.children, opt);

  return this._unescape(html, opt.onServerCode);
};

HtmlDom.prototype.beautify = function(opt) {
  var beautify = require('./beautify/index');
  var html = beautify(this.dom.children, opt || {});
   
  return this._unescape(html);
};

module.exports = HtmlDom;