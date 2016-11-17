var fs = require('fs');
var path = require('path');
var HtmlDom = require('../../htmldom');
var assert = require('assert');

function readFileSync(filepath) {
  return fs.readFileSync(path.join(__dirname, filepath), { encoding: 'utf8' });
}

function writeFileSync(filepath, content) {
  return fs.writeFileSync(path.join(__dirname, filepath), content, { encoding: 'utf8' });
}

describe('stringify', function() {
  it('table', function() {
    var code = readFileSync('html/table.html');
    var html = new HtmlDom(code);
    var newcode = html.stringify();

    writeFileSync('stringify/table.html', newcode);
  });

  it('ul', function() {
    var code = readFileSync('html/ul.html');
    var html = new HtmlDom(code);
    var newcode = html.stringify();

    writeFileSync('stringify/ul.html', newcode);
  });

  it('style', function() {
    var code = readFileSync('html/style.html');
    var html = new HtmlDom(code);
    var newcode = html.stringify();

    writeFileSync('stringify/style.html', newcode);
  });

  it('script', function() {
    var code = readFileSync('html/script.html');
    var html = new HtmlDom(code);
    var newcode = html.stringify();

    writeFileSync('stringify/script.html', newcode);
  });

  it('ie hack', function() {
    var code = readFileSync('html/iehack.html');
    var html = new HtmlDom(code);
    var newcode = html.stringify();

    assert.equal(newcode, '<!DOCTYPE html><!--[if lt IE 7]><html lang="en" class="ie ie6 lte9 lte8 lte7 os-mac"><![endif]--><!--[if IE 7]><html lang="en" class="ie ie7 lte9 lte8 lte7 os-mac"><![endif]--><!--[if IE 8]><html lang="en" class="ie ie8 lte9 lte8 os-mac"><![endif]--><!--[if IE 9]><html lang="en" class="ie ie9 lte9 os-mac"><![endif]--><!--[if gt IE 9]><html lang="en" class="os-mac"><![endif]--><html lang="en" class="os-mac"><!--<![endif]--></html>');
  });

  it('uglify inline event', function() {
    var html = new HtmlDom('<body onselectstart="return false">');

    assert.equal(html.stringify(), '<body onselectstart="return!1"></body>')
  });

  it('style', function() {
    var html = new HtmlDom('<body style="color: red;">');

    assert.equal(html.stringify(), '<body style="color:#f00"></body>');
  });

  it('removeAttributeQuotes', function() {
    var html = new HtmlDom('<div id="key" value="a b" data-id="" data-key="" data-url="/index">');
    var code = html.stringify({
      removeAttributeQuotes: true
    });

    assert.equal(code, '<div id=key value="a b" data-id data-key data-url="/index"></div>');
  });
 
});