# TaiwanStat long term data

Please only use `gh-pages` for main html page

## All website should embbed a layout

header: 

```
<meta charset='utf-8'>
<meta http-equiv="Content-Type" content="text/html"; charset="utf-8">
/* og:title, og:site_name should be like "用數據看台灣 - <your chart name>" */
<meta property="og:title" content="用數據看台灣 - 臺灣垃圾清理統計">
<meta property="og:site_name" content="用數據看台灣 - 臺灣垃圾清理統計">

/* og: description  content should be abstract of the chart's fb post. */
<meta property="og:description" content="台灣每年產生700萬噸以上的垃圾(一天2萬噸)，這麼大量的垃圾如何處理是一個重要的課題。究竟衛生掩埋、焚化、資源回收，哪個才是台灣垃圾處理最大宗？而2002年環保暑發佈了《垃圾回收再利用法》是否改變了台灣垃圾處理的方式？">
<meta property="og:image" content="http://i.imgur.com/04AFcnA.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="300">
<meta property="og:image:height" content="300">
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

/* title should be like "用數據看台灣 - <your chart name>" */
<title>用數據看台灣 - 臺灣垃圾清理統計</title>
```

body should put a layout html, such as:

```
<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header" id="layout-header">
  <main class="mdl-layout__content" id="main-content">
    <div class="fb-plugin">
      <div class="fb-like-box" data-href="https://www.facebook.com/taiwanstat?fref=ts" data-colorscheme="light" data-show-faces="false" data-header="false" data-stream="false" data-show-border="false"></div>
      <div class="fb-like" data-href="http://long.taiwanstat.com/garbage" data-width="300px" data-layout="standard" data-action="like" data-show-faces="true" data-share="true"></div>
    </div>

    /* your chart's container can only put here*/

  </main>
</div>
```

css:

```
<link rel="stylesheet" href="/bower_components/semantic/dist/semantic.min.css" type="text/css" media="all" />
<link rel="stylesheet" href="/css/style.css" type="text/css" media="all" />
```

code should be include js, put it in footer:

```
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-61023469-1', 'auto');
ga('send', 'pageview');
</script>
<div id="fb-root"></div>
<script>
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&appId=600079286760117&version=v2.0";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
</script>
<script src="/js/main_head.js"></script>
<script src="/js/main.js"></script>
```


## Open Data
[hackpad](https://hackpad.com/open-data-NfBKJugHykJ)


## TODO

- collabrate guidelines
- support all charts
- add footer
- add email subscribe
