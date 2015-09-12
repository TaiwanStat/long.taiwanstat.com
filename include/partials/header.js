module.exports= function (hbs) {

  var b_header = '<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header" id="layout-header">';
  b_header += '<main class="mdl-layout__content" id="main-content">';

  // register a partial
  hbs.registerPartial('header', b_header);

};
