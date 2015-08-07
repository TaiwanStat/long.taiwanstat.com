module.exports= function (hbs) {

  var b_end = '</main>'
      b_end += '</div>'
      b_end += '<script src="/js/main_head.js"></script>'
      b_end += '<script>'
      b_end += "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){"
      b_end += "(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),"
      b_end += "m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)"
      b_end += "})(window,document,'script','//www.google-analytics.com/analytics.js','ga');"
      b_end += "ga('create', 'UA-61023469-1', 'auto');"
      b_end += "ga('send', 'pageview');"
      b_end += '</script>'
      b_end += '<div id="fb-root"></div>'
      b_end += '<script>'
      b_end += '(function(d, s, id) {'
      b_end += 'var js, fjs = d.getElementsByTagName(s)[0];'
      b_end += 'if (d.getElementById(id)) return;'
      b_end += 'js = d.createElement(s); js.id = id;'
      b_end += 'js.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&appId=600079286760117&version=v2.0";'
      b_end += 'fjs.parentNode.insertBefore(js, fjs);'
      b_end += "}(document, 'script', 'facebook-jssdk'));"
      b_end += '</script>'
  // register a partial
  hbs.registerPartial('end', b_end);

}
