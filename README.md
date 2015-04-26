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
Exports HtmlDom to front, then uglify it
```
browserify htmldom.js -s HtmlDom > htmldom.front.js 
uglifyjs htmldom.front.js -o htmldom.front.js
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
  children: [],
  // Parent is null or a tag
  parent: {

  }
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
* {object} ``options``
* {object} ``options.cssdom``  
Use [cssdom](https://github.com/douzi8/cssdom) beautify css code
* {object} ``options.uglifyJs``  
Use [uglify-js](https://www.npmjs.com/package/uglify-js) uglify js code
```js
html.stringify({
  uglifyJs: {}
});
```

### beautify()
* {object} ``options``
* {string} ``[options.indent='  ']`` code indent
* {object} ``[options.cssdom]``  
Use [cssdom](https://github.com/douzi8/cssdom) beautify css code
* {object} ``[options.jsBeautify]``  
Use [js-beautify](https://www.npmjs.com/package/js-beautify) beautify js code
```js
html.beautify({
  indent: '  ',
  jsBeautify: {}
});
```
