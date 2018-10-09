var fs = require('fs');
var path = require('path');
var HtmlDom = require('../../htmldom');

function readFileSync(filepath) {
  return fs.readFileSync(path.join(__dirname, filepath), { encoding: 'utf8' });
}

function writeFileSync(filepath, content) {
  return fs.writeFileSync(path.join(__dirname, filepath), content, { encoding: 'utf8' });
}

describe('beautify', function() {
  it('table', function() {
    var code = readFileSync('html/table.html');
    var html = new HtmlDom(code);
    var newcode = html.beautify();

    writeFileSync('beautify/table.html', newcode);
  });

  it('ul', function() {
    var code = readFileSync('html/ul.html');
    var html = new HtmlDom(code);
    var newcode = html.beautify();

    writeFileSync('beautify/ul.html', newcode);
  });

  it('style', function() {
    var code = readFileSync('html/style.html');
    var html = new HtmlDom(code);
    var newcode = html.beautify();

    writeFileSync('beautify/style.html', newcode);
  });

  it('wx', function() {
    var code = readFileSync('html/wx.html');
    var html = new HtmlDom(code);
    var newcode = html.beautify({
      selfClosed: true
    });

    writeFileSync('beautify/wx.html', newcode);
  });

  it('script', function() {
    var code = readFileSync('html/script.html');
    var html = new HtmlDom(code);
    var newcode = html.beautify();

    writeFileSync('beautify/script.html', newcode);
  });

  it('comment', function() {
    var code = readFileSync('html/comment.html');
    var html = new HtmlDom(code);
    var newcode = html.beautify();

    writeFileSync('beautify/comment.html', newcode);
  });
});

  