module.exports= function (hbs) {

  var b_footer = '<script src="/js/main.js"></script>'
  // register a partial
  hbs.registerPartial('footer', b_footer);

}
