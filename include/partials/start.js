module.exports= function (hbs) {

  var b_start = '<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header" id="layout-header">';
  b_start += '<main class="mdl-layout__content" id="main-content">'
  b_start += '<h2 id="title">{{chart_description.title}}</h2>'
  b_start += '<div class="fb-plugin">'
  b_start += '<div class="fb-like-box" data-href="https://www.facebook.com/taiwanstat?fref=ts" data-colorscheme="light" data-show-faces="false"></div>'
  b_start += '<div class="fb-like" data-href="http://long.taiwanstat.com/{{chart_description.url}}" data-width="300px" data-layout="standard" data-action="like" data-show-faces="true" data-share="true"></div>'
  b_start += '</div>'
  // register a partial
  hbs.registerPartial('start', b_start);

}
