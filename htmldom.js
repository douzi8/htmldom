var Scanner = require('./lib/scanner');
var Parser = require('./lib/parser');
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

  // Scanner html code
  var scanner = new Scanner(str, this._escape);
  // Parser html dom
  var parser = new Parser(scanner.dom);

  this.dom = parser.dom;
  
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