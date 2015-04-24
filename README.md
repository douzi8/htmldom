# htmldom — Make html string as dom structure
[![NPM](https://nodei.co/npm/htmldom.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/htmldom/)
```js
var HtmlDom = require('htmldom');
```
## install
```
npm install htmldom --save
```

## test
```
npm test
```

## browserify
Exports HtmlDom to front
```
browserify htmldom.js -s HtmlDom > htmldom.front.js
```

## API
### Constructor(code)
* {string} ``code`` html string
```js
var html = new HtmlDom('<div>1</div>');
```

### dom
The structure of html dom, it's an array with object item, list item type
```js
html.dom
```
* ``documentType``
```js
{
  type: 'documentType',
  value: '<!doctype html>'
}
```
* ``tag``
```js
{
  type: 'tag',
  name: 'div',
  attributes: {
    id: 'test'
  },
  children: []
}
```
* ``text``
```js
{
  type: 'text',
  value: 'welcome'
}
```
* ``comment``
```js
{
  type: 'comment',
  value: 'header comment'
}
```

### stringify()
Minify html code
```js
html.stringify();
```

### beautify();
* {object} ``options``
* {string} ``[options.indent='  ']`` code indent
* {object} ``[options.jsBeautify]``  https://www.npmjs.com/package/js-beautify
Use js-beautify beautify js code
```js
html.beautify({
  indent: '  '
});
```
