"use strict";
(function(window, document, undefined) {

		var discussion = '<discussion style= "margin: 20px;>'
				discussion += '<h3 id="discussion_title">數據討論區</h3>'
				discussion += '<div id="fb-root"></div>'
				discussion += '<script>'
				discussion += '(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.3&appId=1659889874241396";fjs.parentNode.insertBefore(js, fjs);}(document, "script", "facebook-jssdk"));'
				discussion += '</script>'
				discussion +='<div class="fb-comments" data-href="' + document.location.href + '" data-width="100%" data-numposts="8"></div>'
				discussion += '</discussion>'

	var embed = '<div id = "embed" class = "ui form" style="margin: 20px; width: 85%; float: left;">'
			embed += '<div class = "field">'
			embed += '<label style = "font-size: 20px; margin-bottom: 5px;">網頁嵌入碼</label>'
			embed += '<input type = "text" style = "font-size: 15px" value = \'<iframe src = "' + document.URL + '" width = "800" height = "600" frameborder = "0"></iframe>\'>'
			embed += '</div></div>'

	$('#main-content').append(embed);
	$('#main-content').append(discussion);

	if(window.parent != window) {
	    $("body").find(".fb-plugin").remove();
	    $("body").find("discussion").remove();
	    $("body").find("#embed").remove();
		  $("body").find("header").remove();
		  $("body").find("footer").remove();
	    $("body").append("<div id='background'></div>");
	}

  var window_width = $(window).width();

  if(window_width < 400) {
    $('.demo-card-wide').width((window_width -20) + 'px')
  }

	function author(ID) {
    $.getJSON('/member.json', function(response) {
      var authors = response.data.member;
      console.log(authors);
      for (var i in authors) {
        console.log(authors[i].ID);
        if (authors[i].ID == ID) {
          var str = '<div class="author"><h4>About Author</h4>';
              str += '<img src="' + authors[i].photo + '">';
              str += '<div class="author-info"><h5>' + authors[i].name + '</h5></div>';
              str +=  '</div>';

          $('discussion').before(str);
        }
      }
    });
	}


})(window, document)
