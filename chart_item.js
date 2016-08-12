var path = require('path');
var url = require('url');

var lists = require('./lists.json');
//var partial_arr = ["./include/partials/header.js", "./include/partials/start.js", "./include/partials/end.js", "./include/partials/footer.js", "./include/partials/head.js"];
var post_arr = [];

post_arr.push(lists);

lists.data.page.forEach(function(p) {
  if(!url.parse(p.url).protocol) {
  	//p.img = 'https://s3-ap-northeast-1.amazonaws.com/static.twstat.com/statistics/' + p.img;

    post_arr.push({
      "data": {
        "chart_description": p,
        "domain": "http://long.taiwanstat.com/"
      },
      "partials": './include/partials.js',
      "layout": path.join(p.url, "index.hbs"),
      "filename": path.join(p.url, "index.html")
    });
  }
});

module.exports = post_arr;
