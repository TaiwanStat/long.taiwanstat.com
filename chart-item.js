var lists = require('./sample_list.json');
var partial_arr = ["./include/partials/header.js", "./include/partials/start.js", "./include/partials/end.js", "./include/partials/footer.js"];
var post_arr = [];

post_arr.push(lists);

lists.data.page.forEach(function(p) {
  post_arr.push({
    "data": {
      "chart_description": p
    },
    "partials": partial_arr,
    "layout": p.link + "index.hbs",
    "filename": p.link + "index.html"
  })
})


module.exports = post_arr;
