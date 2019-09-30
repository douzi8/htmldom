# htmldom — Simplified html or xml handle in nodejs
[![NPM](https://nodei.co/npm/htmldom.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/htmldom/)
```js
const createHtmlDom = require('htmldom')

let $ = createHtmlDom('<div><button>1</button><a href="https">2</a></div>')

$('*').each((index, item) => {
  let $item = $(item)  
})

$('div button').addClass('title').attr('k', 'v')
$('a').attr('href')
$('div').find('a').attr('data-id', '5')

// Get last html code
$.html()
```
## install
```
npm install htmldom --save
```

## test
```
npm run test
```

## umd
Open [test.html](https://github.com/douzi8/htmldom/blob/master/test.html) with browser
```
npm run umd
```

## API

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
let $ = createHtmlDom('html code')

$('*').each((index, item) => {
  // Origin dom data 
  console.log(item)

  // Like jQuery object
  let $el = $(item)
})

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
$('').attr({
  k: 'v',
  'data-id': 'v2',
  k3: null
});                          // multiple assign
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
* outerHTML
```js
$('div').outerHTML()
```
* clone
```js
$('#id').clone()
```
* replaceWith(content)
* append(content)
* prepend(content)
* before(content)
* after(content)
```js
$('div').replaceWith('<view></view>')
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

### $.nodes
Get a dom tree
```js
/**
 * <div id="test" class="title header" style="color:red;width:200px;"></div>
 */
 {
   type: 'tag',
   name: 'div',
   attributes: {
     class: 'title header',
     id: 'test',
     style: 'color:red;width:200px;'
   },
   parent: null,
   children: [],
   classList: new Set(['title', 'header']),
   style: {
     color: 'red',
     width: '200px'
   }
 }
```

```js
/**
 * raw tag (script, style, textarea)
 * <script>alert(1)</script>
 */
{
  type: 'tag',
  name: 'script',
  tagType: 'rawTag',
  textContent: 'alert(1)'
}
```
```js
/**
 * selfClosingTag
 * <image src="" />
 */
{ 
  type: 'tag',
  name: 'image',
  attributes: { src: '' },
  tagType: 'selfClosingTag'
}
```
```js
/**
 * voidTag
 * <input>
 */
{ 
  type: 'tag',
  name: 'input',
  tagType: 'voidTag',
}
```

```js
/**
 *  text tag
 */
 {
  type: 'text',
  data: 'text tag'
 }

```

```js
/**
 *  <!-- comemnt data -->
 */
 {
  type: 'comment',
  data: ' comemnt data '
 }

```

### $.root()
```js
let $ = createHtmlDom('<div></div>')

$.root().prepend('<head></head>')

// true
$.root().find('div')[0] === $('div')[0]

// '<head></head><div></div>'
$.html()
```

### $.html()
If you want get html string fast, choose this api, it's only output origin html code
```js
$.html()
```

### $.uglify()
* {object} ``options``
  * {string} ``[options.removeAttributeQuotes=false]``
  ```html
    <div id="test"></div> => <div id=test></div>
  ```

```js
// Uglify inline script like this
$('script').each((index, item) => {
  let type = $(item).attr('type')

  if (type && type !== 'text/javascript') return 

  // Find a uglify plugin by yourself
  item.textContent = uglifyJs(item.textContent)
})

// Uglify inline style like this
$('style').each((index, item) => {
  let type = $(item).attr('type')

  if (type && type !== 'text/css') return 

  // Find a uglify plugin by yourself
  item.textContent = uglifyCss(item.textContent)
})


$.uglify()

$.uglify({
  removeAttributeQuotes: true
})
```

### $.beautify()
* {object} ``options``
  * {string} ``[options.indent='  ']`` code indent
```js
$.beautify({
  indent: '  '
});
```