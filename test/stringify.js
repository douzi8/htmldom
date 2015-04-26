var fs = require('fs');
var path = require('path');
var HtmlDom = require('../../htmldom');

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
});