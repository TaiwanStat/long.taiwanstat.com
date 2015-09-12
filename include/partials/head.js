module.exports= function (hbs) {

  var head_str = '<meta charset="utf-8">';
  head_str += '<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">';
  head_str += '<link rel="icon" type="image/png" href="/favicon.ico" />'
  head_str += '<meta property="og:title" content="用數據看台灣 - {{chart_description.title}}">'
  head_str += '<meta property="og:site_name" content="用數據看台灣 - {{chart_description.title}}">'
  head_str += '<meta property="og:description" content="{{chart_description.description}}">'
  head_str += '<title>用數據看台灣 - {{chart_description.title}}</title>'
  head_str += '<meta http-equiv="Content-Type" content="text/html"; charset="utf-8">'
  head_str += '<meta property="og:image" content="http://i.imgur.com/04AFcnA.png">'
  head_str += '<meta property="og:image:type" content="image/png">'
  head_str += '<meta property="og:image:width" content="300">'
  head_str += '<meta property="og:image:height" content="300">'
  head_str += '<meta name="viewport" content="width=device-width, initial-scale=1.0" />'
  head_str += '<link rel="stylesheet" href="/bower_components/semantic/dist/semantic.min.css" type="text/css" media="all" />'
  head_str += '<link rel="stylesheet" href="/css/style.css" type="text/css" media="all" />'
  head_str += '<script type="text/javascript" src="http://d3js.org/d3.v3.min.js"></script>'
  head_str += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>'
  head_str += '<script src="/bower_components/semantic/dist/semantic.min.js"></script>'
  head_str += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">';

	var mdl = '<link rel="stylesheet" href="https://storage.googleapis.com/code.getmdl.io/1.0.2/material.indigo-pink.min.css">';
			mdl += '<script src="https://storage.googleapis.com/code.getmdl.io/1.0.2/material.min.js"></script>';
			mdl += '<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">';

  head_str += mdl;

  // register a partial
  hbs.registerPartial('head', head_str);

}
