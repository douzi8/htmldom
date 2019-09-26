const cheerio = require('cheerio');
const $ =  cheerio.load(`<ul>
        <li name2="demo">
          <div>1</div>
        <li>
          <div>2</div>
      </ul>`);


var cssSelector = require('./selector/css');



console.log(cssSelector.parser('*'))

$('[name2 = demo]').each((index, item) => {
  console.log(item)
})

/*$('div').each((index, item) => {
  console.log(item.attribs)
})
*/
/*$('input').each((index, item) => {
  console.log(item.attribs)
})
*/


//console.log($.html())

/*console.log($('ddddd').html())
console.log($('input').html() + '3')*/

console.log($.root().html())