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

## online demo
[http://douzi8.github.io/htmldom/](http://douzi8.github.io/htmldom/)

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

### $(selector)
* {string} ``selector``, only support attribute, id, class
it will return html dom object
  * #id
  * .class
  * element
  * [attribute]
  * [attribute=value]

support jQuery method list
* length
```
$('').length;
$('')[0]        // first element
$('')[1]        // second
```
* addClass(class)
```
$('').addClass('cls');
$('').addClass('cls1 cls2');
```
* removeClass(class)
```
$('').removeClass()           // remove all class
$('').removeClass('one')      // remove one
$('').removeClass('one two')  // remove multiple
```
* attr(key, value)
```js
$('').attr('key', 'value')   // assign
$('').attr({});              // multiple assign
$('').attr('key', null)      // remove attr
```
* html(html)
```
$('').html()                 // get html
$('').html('12')             // set html
```
* each(function(index, item) {})
```
$('').each(function(index, item) {
  
});
```
```js
var $ = html.$.bind(html);

$('div').addClass('cls');
$('#id').attr('key').addClass('cls');
$('[key=value]').html('<div></div>');
```

### stringify()
* {object} ``options``
  * {boolean} ``[options.booleanAttributes=false]`` remove boolean attribute   
  ```html
  <input disabled="disabled"> => <input disbaled>
  ```
  * {boolean} ``[options.removeJsType=true]``
  ```html
  <script type="text/javascript"></script> => <script></script>
  ```
  * {boolean} ``[options.removeCssType=true]``
  ```html
  <style type="text/css"></style> => <style></style>
  ```
  * {array} ``[options.jsCodeType]`` js code type
  ```html
  <script type="text/config">
    // This also js code
    // Set options.jsCodeType = ['text/config'] for uglify js code
    var a = 4;
  </script>
  ```
  * {array} ``[options.templateType]`` html code type
  ```html
  <script type="text/template">
    <!-- This is html code
     Set options.templateType = ['text/template'] for uglify html code -->
    <div>
    </div>
  </script>
  ```
  * {object} ``[options.cssdom]``  
Use [cssdom](https://github.com/douzi8/cssdom) uglify css code
  ```html
  <style>
  a{
    color:red;
  }
  </style>
  ```
  * {object} ``[options.uglifyJs]``  
Use [uglify-js](https://www.npmjs.com/package/uglify-js) uglify js code
  ```html
  <script>
  var a = 5;
  </script>
  ```
```js
html.stringify({
  booleanAttributes: true,
  templateType: ['text/template']
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
