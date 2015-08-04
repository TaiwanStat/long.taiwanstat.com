var margin = {top:20, right: 30, bottom: 20, left: 30}, 	
	width = 960 - margin.right - margin.left, 
	height = 500 - margin.top - margin.bottom; 

var svg = d3.select("#chart").append("svg") 
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g") 
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 


d3.csv("taxation.csv", function(data) { 

	var taxationList = d3.keys(data[0]); 	
	console.log(taxationList); 

	for (var i = 0; i < data.length; i ++) { 
		 

	}

});


