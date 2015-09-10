"use strict";
(function(window, document, undefined) {

	var str = '<header class="mdl-layout__header">';
		str += '<div class="mdl-layout__header-row">';
		str += '<span class="mdl-layout-title"><a href="http://real.taiwanstat.com/" style="color: #FFF"><img src="/images/assert/round-logo.png" id="round-logo"/>用數據看台灣</a></span>';
		str += '<div class="mdl-layout-spacer"></div>';
		str += '<nav class="mdl-navigation mdl-layout--large-screen-only">';
    str += '<a class="mdl-navigation__link" href="http://global.taiwanstat.com/r/">世界即時資訊</a>';
    str += '<a class="mdl-navigation__link" href="http://global.taiwanstat.com/l/">世界統計資訊</a>';
		str += '<a class="mdl-navigation__link" href="http://real.taiwanstat.com/">台灣開放即時資料</a>';
		str += '<a class="mdl-navigation__link" href="http://long.taiwanstat.com">台灣開放統計資料</a>';
		str += '<a class="mdl-navigation__link" href="http://taiwanstat.com/opendata">開放資料分析部落格</a>';
		str += '<a class="mdl-navigation__link" href="https://www.facebook.com/taiwanstat">Facebook 粉專</a>';
		str += '</nav>';
		str += '</div>';
		str += '</header>';
		str += '<div class="mdl-layout__drawer">';
		str += '<span class="mdl-layout-title"><a href="http://real.taiwanstat.com/"><img src="/images/assert/round-logo.png" id="round-logo"/>用數據看台灣</a></span>';
		str += '<nav class="mdl-navigation">';
    str += '<a class="mdl-navigation__link" href="http://global.taiwanstat.com/r/">世界即時資訊</a>';
    str += '<a class="mdl-navigation__link" href="http://global.taiwanstat.com/l/">世界統計資訊</a>';
		str += '<a class="mdl-navigation__link" href="http://real.taiwanstat.com/">台灣開放即時資料</a>';
		str += '<a class="mdl-navigation__link" href="http://long.taiwanstat.com">台灣開放統計資料</a>';
		str += '<a class="mdl-navigation__link" href="http://taiwanstat.com/opendata">開放資料分析部落格</a>';
		str += '<a class="mdl-navigation__link" href="https://www.facebook.com/taiwanstat">Facebook 粉專</a>';
		str += '</nav>';
		str += '</div>';

	var mdl = '<link rel="stylesheet" href="https://storage.googleapis.com/code.getmdl.io/1.0.2/material.indigo-pink.min.css">';
			mdl += '<script src="https://storage.googleapis.com/code.getmdl.io/1.0.2/material.min.js"></script>';
			mdl += '<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">';

	$('head').append(mdl);
	$('#layout-header').prepend(str);

})(window, document)
