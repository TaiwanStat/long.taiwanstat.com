# TaiwanStat long term data

Please only use `gh-pages` for main html page

## Table of content

- [Develop](#develop)
  - [Prerequisite](#prerequisite)
  - [install](#install)
  - [Twstat cli tool](#twstast-cli)
  - [Run canner -core](#run)
- [Guidelines](#guidelines)
  - [Open a new project](#open-a-new-project)
  - [Setup new project](#setup-new-project)

## Develop

Install `canner-core`

#### Prerequisite

- npm
- nodejs

#### Install

```
sudo npm install -g canner-core
```

#### Twstat-cli

A cli tool for taiwanstat.

[See details and docs](https://github.com/TaiwanStat/twstat-cli)

#### Run

Build the project once:

```
canner-core build chart-item.js
```

Keep watching the project rebuild when it modified:

```
canner-core watch chart-item.js
```

## GuideLines

#### Open a new project

開始一個新專案第一步先創立一個新的 folder 看你這個圖表要叫做什麼，例如：cancer，就在 root folder 下面開一個新的資料夾。只要 root folder 下面沒有重複的專案，就代表你可以使用這個 name 喔 :)

然後到 `lists.json` 裡面找到 `data.page` 裡面是一個 array, 在 array 的第一個 **item 之前** create 你的 project object.

會像是：

```js
{
  // 專案的 title
  "title": "2007 ~ 2014 年台灣垃圾處理統計",
  // 專案的 url 一定要跟你 create folder 的 name 要一樣
  "url": "garbage",
  // 專案的圖片一律存在 images 這個 folder 的下面
  "img": "images/garbage.png",
  // 當你在 fb fans page po 的文複製到 description
  "description": "台灣每年產生 700 萬噸以上的垃圾(一天2萬噸)，這麼大量的垃圾如何處理是一個重要的課題。究竟衛生掩埋、焚化、資源回收，哪個才是台灣垃圾處理最大宗？而2002年環保暑發佈了《垃圾回收再利用法》是否改變了台灣垃圾處理的方式？"
}
```

#### Setup new project

要開始一個新專案首先要先創立一個新的 `index.hbs` 在你剛創立的那個 folder 下面，那個 `hbs`，裡面有很重要的四個區域 `{{> header}}`, `{{> start}}`, `{{> end}}`, `{{> footer}}` 這四個區域分別會 include 一些 script。

下面是一個 example 的 `index.hbs` ，後面分別會講述各部分 include 什麼東西。

`index.hbs`: 

```html
<!DOCTYPE html>
<head>
  {{> header}}
    <!-- my js & css -->
</head>
<body>
  {{> start}}
    <!-- my charts -->
  {{> end}}
    <!-- my js & css -->
  {{> footer}}
</body>
```

### `{{> header}}`

header 區塊會 include 下面這些東西, `semantic`, `d3.js`, `jquery`, `meta`, `title`..., 所以請不要在其他地方重新宣告。

```html
<meta charset="utf-8">
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
<link rel="icon" type="image/png" href="/favicon.ico" />
<meta property="og:title" content="用數據看台灣 - {{chart_description.title}}">
<meta property="og:site_name" content="用數據看台灣 - {{chart_description.title}}">
<meta property="og:description" content="{{chart_description.description}}">
<title>用數據看台灣 - {{chart_description.title}}</title>
<meta http-equiv="Content-Type" content="text/html"; charset="utf-8">
<meta property="og:image" content="http://i.imgur.com/04AFcnA.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="300">
<meta property="og:image:height" content="300">
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="stylesheet" href="/bower_components/semantic/dist/semantic.min.css" type="text/css" media="all" />
<link rel="stylesheet" href="/css/style.css" type="text/css" media="all" />
<script type="text/javascript" src="http://d3js.org/d3.v3.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="/bower_components/semantic/dist/semantic.min.js"></script>
```

### `{{> start}}`

我們的 header & footer 用 google 所開發的 material-design 所以他會引入一些 material-design 的一些 structure code ，[看 material-design doc](https://www.google.com/design/spec/material-design/introduction.html)

header 引入了 mdl 的 header & main 然後也把這個圖表的 title & fb likes 都呈現出來，所以後面只要專心畫圖就好了，不用再寫 fb likes 的 code

header:

```html
<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header" id="layout-header">
    <main class="mdl-layout__content" id="main-content">
        <h2 id="title">{{chart_description.title}}</h2>
        <div class="fb-plugin">
            <div class="fb-like-box" data-href="https://www.facebook.com/taiwanstat?fref=ts" data-colorscheme="light" data-show-faces="false"></div>
            <div class="fb-like" data-href="http://long.taiwanstat.com/{{chart_description.url}}" data-width="300px" data-layout="standard" data-action="like" data-show-faces="true" data-share="true"></div>
        </div>
```

### `{{> end}}`

footer 包含 mdl 的 close tag, 整個網站的 header & footer 的 template 用 js 加入，然後包含 google analytics, fb script.

end:

```html
  </main>  
</div>
<!-- header template -->
<script src="/js/main_head.js"></script>
<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', 'UA-61023469-1', 'auto');ga('send', 'pageview');</script>
<div id="fb-root"></div>
<script>(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&appId=600079286760117&version=v2.0";fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));</script>
```

### `{{> footer}}`

數據討論區，嵌入碼引入

footer:

```html
<script src="/js/main.js"></script>
```

## Open Data
[hackpad](https://hackpad.com/open-data-NfBKJugHykJ)

