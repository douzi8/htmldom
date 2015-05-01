# htmldom — Simplified html handle in nodejs
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
### Constructor(code, escape)
* {string} ``code`` html string
* {array} ``[escape]`` escape server code
```js
// html code
var html = new HtmlDom('<div>1</div>');

// underscore template
var html = new HtmlDom('<div <%= a %>></div>', [/<%([\s\S]+?)%>/g]);

// AngularJs template
var html = new HtmlDom('<div {{name}}></div>', [/\{\{([\s\S]+?)\}\}/g]);
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
$('').attr({});              // multiple assign
$('').attr('key', null)      // remove attr
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
```js
$('').append('<h3>title');
```
* prepend(content)
```js
$('').prepend('<h3>title');
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
The api is deprecated. The ``$`` is faster then ``find``.
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
  // this.document means current html dom structor
  var $item = $(item, this.document);
});
```

### html()
If you want get html string fast, choose this api, it's only output origin html code
```js
html.html()
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
  * {function} ``[options.onServerCode]`` uglify server code callback
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
  templateType: ['text/template'],
  // handle server code by callback
  onServerCode: function(code) {
    return code;
  },
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