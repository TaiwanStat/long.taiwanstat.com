module.exports= function (hbs) {

  var b_footer = '<script>'
  b_footer += "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){"
  b_footer += "(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),"
  b_footer += "m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)"
  b_footer += "})(window,document,'script','//www.google-analytics.com/analytics.js','ga');"
  b_footer += "ga('create', 'UA-61023469-1', 'auto');"
  b_footer += "ga('send', 'pageview');"
  b_footer += '</script>'
  b_footer += '<div id="fb-root"></div>'
  b_footer += '<script>'
  b_footer += '(function(d, s, id) {'
  b_footer += 'var js, fjs = d.getElementsByTagName(s)[0];'
  b_footer += 'if (d.getElementById(id)) return;'
  b_footer += 'js = d.createElement(s); js.id = id;'
  b_footer += 'js.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&appId=600079286760117&version=v2.0";'
  b_footer += 'fjs.parentNode.insertBefore(js, fjs);'
  b_footer += "}(document, 'script', 'facebook-jssdk'));"
  b_footer += '</script>'
  b_footer += '<script src="/js/main_head.js"></script>'
  b_footer += '<script src="/js/main.js"></script>'
  // register a partial
  hbs.registerPartial('footer', b_footer);

}
