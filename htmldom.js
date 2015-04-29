var REG = require('./lib/reg');
var Parser = require('./lib/parser');
var VOID_ELEMENTS = require('./lib/elements').VOID_ELEMENTS;
var Selector = require('./selector/index');
var esc = require('./lib/escape');

function HtmlDom(str, escape) {
  str = (str || '') + '';
  this._escape = [];

  if (escape) {
    for (var i = 0; i < escape.length; i++) {
      str = str.replace(escape[i], esc.escape);
      this._escape.push(esc.escape(escape[i].source));
    }
  }

  this._str = str.trimRight();
  this.dom = [];
  this._scanner();
  /**
   * @example
   * var $ = html.$.bind(html);
   * $('div').addClass()
   * $('#id').attr('key')
   */
  this.$ = function(selector) {
    var el = new Selector(selector, this.dom);
    return el;
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
      // fixed same key bug
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
      name: tagname
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

HtmlDom.prototype._unescape = function(html) {
  for (var i = 0; i < this._escape.length; i++) {
    html = html.replace(new RegExp(this._escape[i], 'g'), esc.unescape);
  }
  return html;
};

// Get html code fast.
HtmlDom.prototype.html = function(dom) {
  var html = [];
  dom = dom || this.dom;

  function recurse(dom) {
    var html = [];
    var name = dom.name;

    switch (dom.type) {
      case 'documentType':
        html.push(dom.value);
        break;
      case 'text':
        html.push(dom.value);
        break;
      case 'comment':
        html.push('<!--' + dom.value + '-->');
        break;
      case 'tag':
        html.push('<' + name);
        for (var i in dom.attributes) {
          var key = i.replace(REG.ATTR_BUG, '');
          if (dom.attributes[i] === null) {
            html.push(' ' + key);
          } else {
            html.push(' ' + key + '="' + dom.attributes[i].replace(REG.DOUBLE_QUOTES, '&quot;') + '"');
          }
        }
        html.push('>');

        if (VOID_ELEMENTS.indexOf(name) == -1) {
          dom.children.forEach(function(item) {
            html.push(recurse(item));
          });
          html.push('</' + name + '>');
        }
    }
    return html.join('');
  }

  for (var i = 0, l = dom.length; i < l; i++) {
    html.push(recurse(dom[i]));
  }

  html = html.join('');
  return this._unescape(html);
};

HtmlDom.prototype.stringify = function(opt) {
  var uglify = require('./uglify/index');
  var html = uglify(this.dom, opt || {});
  return this._unescape(html);
};

HtmlDom.prototype.beautify = function(opt) {
  var beautify = require('./beautify/index');
  var html = beautify(this.dom, opt || {});
  return this._unescape(html);
};

module.exports = HtmlDom;