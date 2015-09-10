module.exports= function (hbs) {

  var header_str = '<meta charset="utf-8">';
  header_str += '<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">';
  header_str += '<link rel="icon" type="image/png" href="/favicon.ico" />'
  header_str += '<meta property="og:title" content="用數據看台灣 - {{chart_description.title}}">'
  header_str += '<meta property="og:site_name" content="用數據看台灣 - {{chart_description.title}}">'
  header_str += '<meta property="og:description" content="{{chart_description.description}}">'
  header_str += '<title>用數據看台灣 - {{chart_description.title}}</title>'
  header_str += '<meta http-equiv="Content-Type" content="text/html"; charset="utf-8">'
  header_str += '<meta property="og:image" content="http://i.imgur.com/04AFcnA.png">'
  header_str += '<meta property="og:image:type" content="image/png">'
  header_str += '<meta property="og:image:width" content="300">'
  header_str += '<meta property="og:image:height" content="300">'
  header_str += '<meta name="viewport" content="width=device-width, initial-scale=1.0" />'
  header_str += '<link rel="stylesheet" href="/bower_components/semantic/dist/semantic.min.css" type="text/css" media="all" />'
  header_str += '<link rel="stylesheet" href="/css/style.css" type="text/css" media="all" />'
  header_str += '<script type="text/javascript" src="http://d3js.org/d3.v3.min.js"></script>'
  header_str += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>'
  header_str += '<script src="/bower_components/semantic/dist/semantic.min.js"></script>'
  header_str += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">';

	var mdl = '<link rel="stylesheet" href="https://storage.googleapis.com/code.getmdl.io/1.0.2/material.indigo-pink.min.css">';
			mdl += '<script src="https://storage.googleapis.com/code.getmdl.io/1.0.2/material.min.js"></script>';
			mdl += '<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">';

  header_str += mdl;

  // register a partial
  hbs.registerPartial('header', header_str);

}
