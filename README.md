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

// Beautify html code
$.beautify()

// Uglify html code
$.uglify()
```
## install
```
npm install htmldom --save
```

## test
```
npm run test
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

### dom structure
```js
$('*').each((index, item) => {
  // Origin dom data 
  console.log(item)

  // Like jQuery object
  let $el = $(item)
})

```
* ``tag``
```js
let node ={
  type: 'tag',
  name: 'div',
  attributes: {
    id: 'test'
  },
  /** 
   * This value is one of ['rawTag', 'voidTag', 'selfClosingTag', null]
   * @example
   * <script>, <style>, <textarea> tag is rawTag
   * <br>, <input> tag is voidTag
   * <image /> tag is selfClosingTag
   * <div> tag is null
   */
  tagType: null,
  children: [],
  // Parent is null or a tag
  parent: {

  }
}

let inputNode = {
  type: 'tag',
  name: 'input',
  tagType: 'voidTag'
}

let scriptNode = {
  type: 'tag',
  name: 'script',
  tagType: 'rawTag',
  value: 'alert(1)'
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

### $.html()
If you want get html string fast, choose this api, it's only output origin html code
```js
$.html()
```

### $.uglify()
```js
// Uglify inline script like this
$('script').each(function(index, item) => {
  let type = $(item).attr('type')

  if (type && type !== 'text/javascript') return 

  let jsCode = item.value

  // Find a uglify plugin
  item.value = uglifyJs(jsCode)
})

// Uglify inline style like this
$('style').each(function(index, item) => {
  let type = $(item).attr('type')

  if (type && type !== 'text/css') return 

  let cssCode = item.value

  // Find a uglify plugin
  item.value = uglifyCss(cssCode)
})


$.uglify()
```

### $.beautify()
* {object} ``options``
  * {string} ``[options.indent='  ']`` code indent
```js
$.beautify({
  indent: '  '
});
```