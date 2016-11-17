var Scanner = require('./lib/scanner');
var Parser = require('./lib/parser');
var $ = require('./selector/index');

function HtmlDom(str) {
  str = (str || '') + '';
  

  // Scanner html code
  var scanner = new Scanner(str);
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



HtmlDom.prototype.html = function() {
  var html = $.prototype.getHtml(this.dom);

  return $.prototype.getHtml(this.dom);
};

HtmlDom.prototype.stringify = function(opt) {
  opt = opt || {};
  var uglify = require('./uglify/index');


  return uglify(this.dom.children, opt);
};

HtmlDom.prototype.beautify = function(opt) {
  var beautify = require('./beautify/index');
   
  return beautify(this.dom.children, opt || {});
};

module.exports = HtmlDom;