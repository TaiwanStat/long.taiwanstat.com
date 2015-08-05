module.exports= function (hbs) {

  var b_end = '</main>'
      b_end += '</div>'
  // register a partial
  hbs.registerPartial('end', b_end);

}
