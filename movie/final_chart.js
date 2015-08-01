var svg_width = 1200; 
var svg_height = 300;

var boxOfficeScale = d3.scale.pow().exponent(1/5)
	.domain([0, 30000000])
	.range([0, svg_width]); 

var weekBoxOfficeScale = d3.scale.pow().exponent(1/2)
	.domain([0, 10000000])
	.range([0, svg_width]); 

var weekScale = d3.scale.linear()
	.domain([0, 10])
	.range([0, svg_width]); 

var colorScale = d3.scale.category10(); 

d3.csv("movie-data.csv", function(error, data) { 	

	for (var i = 0; i < data.length; i++) { 
		data[i].排名 = parseInt(data[i].排名);
	}

   	data.sort(function(a, b) { return a.排名 - b.排名; })
   	console.log(data); 

	var div = d3.select("#chart").selectAll("div")
		.data(data)
		.enter().append("div")
		.attr("class", "movie")
		.attr("width", 1200)
		.attr("height", 400);

	var selectMenu = d3.select("body") 
		.append("div") 
		.attr("id", "selectMenu");

	// console.toLocaleStringg(div);

	for (var i = 0; i < data.length; i++) { 
		data[i].台北週末 = data[i]["台北週末"].split("萬").join("");
		data[i].台北週末 = parseInt(data[i].台北週末.replace("0", "")); 
		data[i].周次 = parseInt(data.周次);
		data[i].累積新台幣 = data[i]["累積新台幣"].split("萬").join("");
		data[i].累積新台幣 = data[i]["累積新台幣"].split("億").join("");
		data[i].累積新台幣 = parseInt(data[i].累積新台幣.replace("0", ""));
		// data[i].累計票房 = parseInt(movies[i]["content"][0].累計票房);
		// data[i].上映週數 = parseInt(movies[i]["content"][0].上映週數);
	}

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
		.attr("width", 1200)
		.attr("height", 300);

	d3.selectAll(".information_box")
		.append("div") 
		.attr("class", "movie_title"); 

	d3.selectAll(".information_box")
		.append("div") 
		.attr("class", "movie_title_english");

	d3.selectAll(".information_box")
		.append("div") 
		.attr("class", "taipeiBoxOffice"); 

	d3.selectAll(".information_box")
		.append("div") 
		.attr("class", "totalBoxOffice"); 

	d3.selectAll(".information_box")
		.append("div") 
		.attr("class", "debutDate"); 

	d3.selectAll(".information_box")
		.append("div") 
		.attr("class", "weekCount"); 

	d3.selectAll(".movie_title")
		.data(data)
		.append("text")
		.attr("class", "title")
		.append("i") 
		.attr("class", "fa fa-play fa-1x")
		.text(function(d) { return " " + d["片名"]; });

	d3.selectAll(".movie_title_english")
		.data(data)
		.append("text")
		.attr("class", "english_title")
		.text(function(d) { return "---" + d["英文片名"] + "---"; });

	d3.selectAll(".taipeiBoxOffice")
		.data(data)
		.append("text")
		.attr("class", "taipeiBoxText")
		.append("i")
		.attr("class", "fa fa-line-chart")
		.text(function(d) { return "台北週末票房: " + d["台北週末"].toLocaleString(); })

	d3.selectAll(".totalBoxOffice")
		.data(data)
		.append("text")
		.attr("class", "totalBoxText")
		.append("i")
		.attr("class", "fa fa-bar-chart")
		.text(function(d) { return "累積票房: " + d["累積新台幣"].toLocaleString(); });
 
	d3.selectAll(".debutDate")
		.data(data)
		.append("text")
		.attr("class", "debutDateText")
		.append("i")
		.attr("class", "fa fa-calendar")
		.text(function(d) { return "上映日期: " + d["上市"]; });

	d3.selectAll(".weekCount")
		.data(data)
		.append("text")
		.attr("class", "weekCountText")
		.append("i")
		.attr("class", "fa fa-calendar-o")
		.text(function(d) { return "上映周次: " + d["周次"]; });

	drawRects(data); 

});

function drawRects(data) { 

	console.log(data);

	d3.selectAll(".svg_canvas")
		.data(data)
		.append("rect")
		.attr("class", function(d, i) { return "totalBoxOffice" + i; }) // individual movie class
		.attr("x", 0) 
		.attr("y", 0)
		.attr("width", function(d) { return boxOfficeScale(d.累積新台幣); })
		.attr("height", 300)
		.attr("fill", "#2A4E6E")
		.style("opacity", 0.5)
		.on("mouseover", function() { 
			d3.select(this).style("opacity", 0.7);
		})
		.on("mouseout", function() { 
			d3.select(this).style("opacity", 0.5);
		});

	d3.selectAll(".svg_canvas") 
		.data(data)
		.append("rect")
		.attr("class", "weekBoxOffice") // individual movie class
		.attr("x", 0) 
		.attr("y", 150)
		.attr("width", function(d) { return weekBoxOfficeScale(d.台北週末); })
		.attr("height", 150)
		.attr("fill", "#EF9F00")
		.style("opacity", 0.5)
		.on("mouseover", function() { 
			d3.select(this).style("opacity", 0.7);
		})
		.on("mouseout", function() { 
			d3.select(this).style("opacity", 0.5); 
		})

	d3.selectAll(".svg_canvas") 
		.data(data)
		.append("circle")
		.attr("class", "rankCircle") // individual movie class
		.attr("cx", 80) 
		.attr("cy", 80)
		.attr("r", 60)
		.attr("fill", "#ffffff"); 

	d3.selectAll(".svg_canvas")
		.data(data) 
		.append("text") 
		.attr("class", "rankText")
		.attr("x", function(d) { 
			if (d.排名 < 10 ) 
				return 60;
			else
				return 35; })
		.attr("y", 100)
		.text(function(d) { return d.排名; });
		
	drawWCRects(data);
}

function drawWCRects(data) { 


d3.selectAll(".svg_canvas") 
		.data(data)
		.append("rect")
		.attr("class", "movieWC") // individual movie class
		.attr("x", 0) 
		.attr("y", 280)
		.attr("width", function(d) { 
			if (isNaN(d.上週)) 
				return 0; 
			else 
				return weekScale(d.上週); })
		.attr("height", 20)
		.attr("fill", "#EF7700")
		.style("opactiy", 0.7);

	attachVideos(data); 

}

function attachVideos(data) { 

	var videoSources = []; 


	for (var i = 0; i < data.length; i++) { 
		videoSources.push(data[i].Youtube);
	}

	console.log(videoSources);
 	
 	d3.selectAll(".video_box")
 		.data(videoSources)
 		.append("iframe")
 		.attr("width", 400)
 		.attr("height", 250)
 		.attr("allowfullscreen", true)
 		.attr("controls", true)
 		.attr("autoplay", true)
 		.attr("src", function(d, i) { return "http://www.youtube.com/embed/" + videoSources[i]; }); 

// <iframe width="560" height="315" src="https://www.youtube.com/embed/sVme5Qew7T4" frameborder="0" allowfullscreen></iframe>
 	// d3.selectAll("video")
 	// 	.data(videoSources)
 	// 	.append("source") 
 	// 	.attr("type", "media_type")
 	// 	.attr("src", function(d, i) { return "https://www.youtube.com/watch?v=" + videoSources[i]; });  

	// d3.selectAll("video") 
	// 	.data(videoSources)



	
	   
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



