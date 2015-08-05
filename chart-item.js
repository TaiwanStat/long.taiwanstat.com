var lists = require('./lists.json');
var partial_arr = ["./include/partials/header.js", "./include/partials/start.js", "./include/partials/end.js", "./include/partials/footer.js"];

module.exports = [
  lists,
  {
    "data": {
      "chart_description": lists.data.page[0],
    },
    "partials": partial_arr,
    "layout": lists.data.page[0].link + "index.hbs",
    "filename": lists.data.page[0].link + "index.html"
  }
]
