(function() {

	var window_width = $(window).width(); 

	if(window_width < 400) {
		$('.demo-card-wide').width((window_width -20) + 'px')
	}
	
})()