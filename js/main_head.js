"use strict";
(function(window, document, undefined) {

	var str = '<header class="mdl-layout__header">'
		str += '<div class="mdl-layout__header-row">'
		str += '<span class="mdl-layout-title"><img src="/images/assert/round-logo.png" id="round-logo"/>用數據看台灣</span>'
		str += '<div class="mdl-layout-spacer"></div>'
		str += '<nav class="mdl-navigation mdl-layout--large-screen-only">'
		str += '<a class="mdl-navigation__link" href="http://real.taiwanstat.com/">台灣開放即時資料</a>'
		str += '<a class="mdl-navigation__link" href="http://long.taiwanstat.com">台灣開放統計資料</a>'
		str += '<a class="mdl-navigation__link" href="http://taiwanstat.com/">用數據看台灣</a>'
		str += '<a class="mdl-navigation__link" href="https://www.facebook.com/taiwanstat">Facebook 粉專</a>'
		str += '</nav>'
		str += '</div>'
		str += '</header>'
		str += '<div class="mdl-layout__drawer">'
		str += '<span class="mdl-layout-title"><img src="/images/assert/round-logo.png" id="round-logo"/>用數據看台灣</span>'
		str += '<nav class="mdl-navigation">'
		str += '<a class="mdl-navigation__link" href="http://real.taiwanstat.com/">台灣開放即時資料</a>'
		str += '<a class="mdl-navigation__link" href="http://long.taiwanstat.com">台灣開放統計資料</a>'
		str += '<a class="mdl-navigation__link" href="http://taiwanstat.com/">用數據看台灣</a>'
		str += '<a class="mdl-navigation__link" href="https://www.facebook.com/taiwanstat">Facebook 粉專</a>'
		str += '</nav>'
		str += '</div>'

	var mdl = '<link rel="stylesheet" href="https://storage.googleapis.com/code.getmdl.io/1.0.2/material.indigo-pink.min.css">'
			mdl += '<script src="https://storage.googleapis.com/code.getmdl.io/1.0.2/material.min.js"></script>'
			mdl += '<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">'

	var footer = '<footer class="mdl-mini-footer" style="height: 50px;">'
 			footer += '<div class="mdl-mini-footer__right-section">'
 			footer += '合作提案、意見回饋歡迎來信至: <a href="mailto:contact@taiwanstat.com">contact@taiwanstat.com</a>'
 			footer += '</div>'
 			footer += '</footer'

	$('head').append(mdl);
	$('#layout-header').prepend(str);
	$('#layout-header').append(footer);


})(window, document)
