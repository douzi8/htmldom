const cheerio = require('cheerio');
const $ = cheerio.load(`<ul>
        <li>
          <div>1</div>
        <li>
          <div>2</div>
      </ul>`);

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