
module.exports= function (hbs) {

	var footer = '<footer class="mdl-mini-footer">';
	    footer += '<div class="mdl-mini-footer__left-section">© 2015 <a href="#">用數據看台灣團隊</a> | ';
	    footer += '<a href="http://www.csie.ncku.edu.tw/ncku_csie/">NCKU-NetDB</a>';
	    footer += '{{#if chart_description.collaborators}}{{#each chart_description.collaborators}} | ';
	    footer += '<a href="{{url}}">{{name}}</a>{{/each}}{{/if}}';
	    footer += '</div>';
 			footer += '<div class="mdl-mini-footer__right-section">';
 			footer += '<span class="footer_msg">合作提案、客製化圖表製作、意見回饋</span></a>歡迎來信: <a href="mailto:contact@taiwanstat.com">contact@taiwanstat.com</a></div>';
 			footer += '</footer>';
 			footer += '<script src="/js/main.js"></script>';

	
  // register a partial
  hbs.registerPartial('footer', footer);

};
