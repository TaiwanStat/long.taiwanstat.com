var n = 5; // number of films
var svg_width = 1200; 
var svg_height = 400;

var boxOfficeScale = d3.scale.linear()
	.domain([0, 300000000])
	.range([0, svg_width]); 

var weekBoxOfficeScale = d3.scale.linear() 
	.domain([0, 100000000])
	.range([0, svg_width]); 

var weekScale = d3.scale.linear()
	.domain([0, 10])
	.range([0, svg_width]); 

d3.json("movie.json", function(error, data) { 	

	var movies = data.movies; 

	var div = d3.select("#chart").selectAll("div")
		.data(movies)
		.enter().append("div")
		.attr("class", "movie")
		.attr("width", 1200)
		.attr("height", 400);

	console.log(div);

	var cover_image = d3.selectAll(".movie")
		.append("div") 
		.attr("class", "cover_image"); 

	var information_box = d3.selectAll(".movie")
		.append("div") 
		.attr("class", "information_box"); 

	var video_box = d3.selectAll(".movie")
		.append("div") 
		.attr("class", "video_box"); 

	var svg_canvas = d3.selectAll(".movie")
		.append("svg") 
		.attr("class", "svg_canvas")
		// .attr("class", "svg_canvas")
		.attr("width", 1200)
		.attr("height", 400);

	console.log(div);

	d3.selectAll(".information_box")
		.append("div") 
		.attr("class", "movie_title"); 

	d3.selectAll(".information_box")
		.append("div") 
		.attr("class", "weekBoxOffice"); 

	d3.selectAll(".information_box")
		.append("div") 
		.attr("class", "totalBoxOffice"); 

	d3.selectAll(".information_box")
		.append("div") 
		.attr("class", "weekCount"); 
	
	d3.selectAll(".movie_title")
		.data(movies)
		.append("text")
		.attr("class", "title")
		.text(function(d) { return d.movie_title; });

	d3.selectAll(".movie_title")
		.data(movies)
		.append("text")
		.attr("class", "totalBoxOffice")
		.text(function(d) { return "累積票房: " + d["content"][0].累計票房; });

	d3.selectAll(".movie_title")
		.data(movies)
		.append("text")
		.attr("class", "weekBoxOffice")
		.text(function(d) { return "本週票房: " + d["content"][0].本週票房; });

	d3.selectAll(".movie_title")
		.data(movies)
		.append("text")
		.attr("class", "weekCount")
		.text(function(d) { return "上映週數: " + d["content"][0].上映週數; });

	// d3.selectAll(".information_box") 
	// 	.data(movies)	
	// 	.append("text")
	// 	.attr("class", "weeklyBoxOffice")
	// 	.text(function(d) { return "本週票房: " + d["content"][0].本週票房; }); 

	// d3.selectAll(".information_box") 
	// 	.data(movies)	
	// 	.append("text")
	// 	.attr("class", "totalBoxOffice")
	// 	.text(function(d) { return "累計票房: " + d["content"][0].累計票房; }); 

	// d3.selectAll(".information_box") 
	// 	.data(movies)	
	// 	.append("text")
	// 	.attr("class", "weekCount")
	// 	.text(function(d) { return "上映週數: " + d["content"][0].上映週數; }); 

	d3.selectAll(".video_box") 
		.data(movies)	
		.append("text")
		.attr("class", "summary")
		.text(function(d) { return "<<簡介>> "; });

	var image_sources = ["ant-man.jpg", "minion2.jpg", "jurassic2.jpg", 
		"gatao.jpg", "conan.jpg"]; 

	d3.selectAll(".cover_image")
		.data(image_sources)
		.append("img") 
		.attr("class", "cover")
		.attr("src", function(d, i) { return image_sources[i]; })
		.attr("width", 250)
		.attr("height", 225); 
	
	d3.selectAll(".movie").selectAll(".svg_canvas")
   		.append("svg")
   		.attr("class", "svg")
   		.attr("height", 400)
   		.attr("width", 1200); 

	cleanUpData(movies)

});

function cleanUpData(movies) { 

	console.log(movies[0]["content"][0]);
	for (var i = 0; i < movies.length; i++) { 
		movies[i]["content"][0].本週票房 = movies[i]["content"][0].本週票房.split(",").join(""); 
		movies[i]["content"][0].本週票房 = parseInt(movies[i]["content"][0].本週票房);
		movies[i]["content"][0].累計票房 = movies[i]["content"][0].累計票房.split(",").join("");
		movies[i]["content"][0].累計票房 = parseInt(movies[i]["content"][0].累計票房);
		movies[i]["content"][0].上映週數 = parseInt(movies[i]["content"][0].上映週數);
	}

	drawRects(movies); 
}

function drawRects(movies) { 

	console.log(movies[0]["content"][0].累計票房);

	d3.selectAll(".svg")
		.data(movies)
		.append("rect")
		.attr("class", function(d, i) { return "totalBoxOffice" + i; }) // individual movie class
		.attr("x", 0) 
		.attr("y", 0)
		.attr("width", function(d) { return boxOfficeScale(d["content"][0].累計票房); })
		.attr("height", 300)
		.attr("fill", "#2A4E6E")
		.style("opacity", 0.3);

	d3.selectAll(".svg") 
		.data(movies)
		.append("rect")
		.attr("class", "weekBoxOffice") // individual movie class
		.attr("x", 0) 
		.attr("y", 150)
		.attr("width", function(d) { return weekBoxOfficeScale(d["content"][0].本週票房); })
		.attr("height", 150)
		.attr("fill", "#5B2971")
		.style("opacity", 0.07);


	drawWCRects(movies);
	
}

function drawWCRects(movies) { 

d3.selectAll(".svg") 
		.data(movies)
		.append("rect")
		.attr("class", "movieWC") // individual movie class
		.attr("x", 0) 
		.attr("y", 225)
		.attr("width", function(d) { return weekScale(d["content"][0].上映週數); })
		.attr("height", 75)
		.attr("fill", "#802B69")
		.style("opactiy", 0.08);

	attachImages(movies); 

}

function attachImages(movies) { 

 
	// $('#movie1pic').prepend('<img id="antman" src="ant-man.jpg" />')
	// $('#movie2pic').prepend('<img id="conan" src="conan.jpg" />')
	// $('#movie3pic').prepend('<img id="gatao" src="gatao.jpg" />')
	// $('#movie4pic').prepend('<img id="jurassic" src="jurassic.jpg" />')
	// $('#movie5pic').prepend('<img id="minion" src="minion.jpg" />')
	


	
	   
// var images = d3.selectAll("g") 
	// 	.data(image_sources)
	// 	.enter() 
	// 	.append("image")

	// for (var i = 0; i < image_sources.length; i++) { 

	// 	var img = document.createElement("img"); 
	// 	img.src = image_sources[i]; 

	// 	var src = document.getElementById("movie_" + i)
	// 	src.appendChild(img); 

	// }
}












