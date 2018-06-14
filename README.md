# htmldom — Simplified html or xml handle in nodejs
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
### Constructor(code, options)
* {string} ``code`` html string
* [object] ``options``
```js
// html code
var html = new HtmlDom('<div>1</div>');
var $ = html.$;

$('div').addClass('test').attr('k', 'v');
console.log(html.html());



// xml code
var xml = new HtmlDom('<?xml version="1.0" encoding="utf-8" ?><tag><item></item></tag>')
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
  isVoid: false,
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
  value: 'header comment',
  isIEHack: false
}
```

### $(selector)
* {string} ``selector`` [w3c selector](http://www.w3schools.com/cssref/css_selectors.asp), support list
  * element
  * &ast;
  * element > element
  * element + element
  * element ~ element
  * #id
  * .class
  * [attribute]
  * [attribute=value]
  * [attribute^=value]
  * [attribute$=value]
  * [attribute~=value]
  * [attribtue*=value]
```js
var $ = html.$;
$('div .class a')
$('.item > *')
$('div + p')
$('.item ~ p')
$('.item > a')
$('.wrap .item')
$('#id li')
$('[title]').attr('key', 'value').addClass('cls').removeClass('cls2');
```

support jQuery method list
* length
```
$('').length;
$('')[0]        // first element
$('')[1]        // second
```
* hasClass(class)
```
$('').hasClass('cls');
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
$('').attr('key', function(index,oldValue) {});
$('').attr({});              // multiple assign
$('').attr('key', null)      // remove attr
```
* data(name, value)
```
<div data-true="true" data-false="false" data-null="null" 
     data-obj='{"key": "value"}' data-array="[1, 2]" 
     data-string="word"></div>

$('div').data('true') === true
$('div').data('null') === null
$('div').data('obj')            // {key: "value" }
$('div').data('id', 5)          // set data
```
* parent(selector)
```
$('').parent()
$('').parent('.cls')
```
* html(content)
```js
$('').html()                 // get html
$('').html('12')             // set html
```
* append(content)
* prepend(content)
* before(content)
* after(content)
```js
$('').append('<h3>title');
$('').before('<h3>title');
```
* remove()
```js
$('').remove();
```
* css(property, value)
```js
$('').css('height');               // get
$('').css('height', '200px');      // set
$('').css('height', null);         // remove
$('').css({
  
});
```
* find(selector)  
```
$('div').find('.item > a')
```
* filter(selector)
```
$('').filter('[data-id=1]')
$('').filter(function(index) {
  return $(this[index]).attr('data-id') == 1;
});
```
* eq(index)
```
$('').eq(0)     // first element
$('').eq(-1)    // last element
```
* each(function(index, item) {})
```
$('').each(function(index, item) {
  var $item = $(item);
});
```

### html()
If you want get html string fast, choose this api, it's only output origin html code
```js
html.html()
// Is tag closed with '/'
html.html({ selfClosed: true })
```

### stringify()
* {object} ``options``
  * {boolean} ``[options.booleanAttributes=false]`` remove boolean attribute   
  ```html
  <input disabled="disabled"> => <input disbaled>
  ```
  * {boolean} ``[options.removeAttributeQuotes=false]``
  ```html
  <div id="test"></div> => <div id=test></div>
  ```
  * {boolean} ``[options.selfClosed]`` Is tag closed with '/'
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
Use [cssdom](https://github.com/douzi8/cssdom) uglify css code with style tag
  ```html
  <style>a { color:red; } </style> => <style>a{color:#f00}</style>
  ```
  * {object} ``[options.uglifyJs]``  
Use [uglify-js](https://www.npmjs.com/package/uglify-js) uglify js code with script tag and inline events
  ```html
  <script> var a = 5; </script>         => ...
  <div onclick="return false"></div>    => <div onclick="return !1"></div>
  ```
```js
html.stringify({
  booleanAttributes: true,
  templateType: ['text/template'],
  selfClosed: false,
  uglifyJs: {}
});
```

### beautify()
* {object} ``options``
  * {string} ``[options.indent='  ']`` code indent
  * {boolean} ``[options.selfClosed]`` Is tag closed with '/'
  * {object} ``[options.cssdom]``  
Use [cssdom](https://github.com/douzi8/cssdom) beautify css code
  * {object} ``[options.jsBeautify]``  
Use [js-beautify](https://www.npmjs.com/package/js-beautify) beautify js code
```js
html.beautify({
  indent: '  ',
  selfClosed: false,
  jsBeautify: {}
});
```