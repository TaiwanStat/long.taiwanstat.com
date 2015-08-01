var first_impression = d3.select("#chart")
	.append("div") 
	.attr("class", "first_impression");
	
var cover_photo = ["ant-man.jpg", "conan.jpg", "minion2.jpg"]; 

d3.select(".first_impression").selectAll(".cover_photo")
	.data(cover_photo)
	.enter() 
	.append("img") 
	.attr("id", function(d, i) { return "cover_photo" + i; })
	.attr("src", function(d) { return "/img/" + d; })
	.attr("width", 425)
	.attr("height", 400); 

var opening_paragraph = d3.select(".first_impression")
	.append("div") 
	.attr("class", "paragraph_container")
	.append("p")
	.attr("class", "opening_paragraph")
	.text("	什麼好看的？火熱的？值得分享的？盡在Taiwan Fun一覽無遺");

var colorScale = d3.scale.category10();

var tip = d3.tip() 
	.attr("class", "d3-tip")
	.offset([-10, 0]); 

d3.csv("movie-data.csv", function(error, data) { 	

	var itemCount; 

	console.log(data.length); 	

	for (var i = 0; i < data.length; i++) { 
		d3.select(".container").append("div")
			.attr("class", "row prototype");
	}

	d3.selectAll(".row")
		.append("div")
		.attr("class", "col-sm-4 intro")
		.append("div") 
		.attr("class", "intro_child"); 

	d3.selectAll(".row")
		.append("div")
		.attr("class", "col-sm-4 stats")
		.append("div") 
		.attr("class", "stats_child"); 
		
	d3.selectAll(".row")
		.append("div")
		.attr("class", "col-sm-4 video")
		.append("div") 
		.attr("class", "video_child");

	cleanUpData(data); 

});


function cleanUpData(data) { 

	for( var i = 0; i < data.length; i++) { 
		data[i].排名 = parseInt(data[i].排名);
	} 

	data.sort(function(a, b) { return a.排名 - b.排名; }); 

	for (var i = 0; i < data.length; i++) { 
		data[i].台北週末 = data[i]["台北週末"].split("萬").join(""); 
		data[i].台北週末 = parseInt(data[i].台北週末.replace("0", "")); 
		data[i].周次 = parseInt(data.周次);
		data[i].累積新台幣 = data[i]["累積新台幣"].split("萬").join("");
		data[i].累積新台幣 = data[i]["累積新台幣"].split("億").join("");
		data[i].累積新台幣 = parseInt(data[i].累積新台幣.replace("0", ""));
		data[i].IMDB_vote = (parseInt(data[i].IMDB_vote).toLocaleString());
	}
	
	d3.selectAll(".intro_child")
		.append("div") 
		.attr("class", "movie_title"); 

	d3.selectAll(".intro_child")
		.append("div") 
		.attr("class", "movie_title_english");

	d3.selectAll(".intro_child")
		.data(data) 
		.append("div") 
		.attr("class", "information_box");

	d3.selectAll(".movie_title")
		.data(data)
		.append("text")
		.attr("class", "title")
		.append("i") 
		.attr("class", "fa fa-play fa-1x")
		.text(function(d) { return " " + d["片名"]; });

	console.log(data); 
	d3.selectAll(".movie_title_english")
		.data(data)
		.append("text")
		.attr("class", function(d) {
			if (d.英文片名 != "Hector and the Search for Happiness") 
				return "english_title"; 
			else 
				return "english_title2"; 
		})
		.text(function(d) { return d["英文片名"]; });

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

	d3.selectAll(".information_box")
		.append("div") 
		.attr("class", "imdbRate"); 

	d3.selectAll(".information_box")
		.append("div") 
		.attr("class", "imdbVote"); 

	d3.selectAll(".taipeiBoxOffice")
		.data(data)
		.append("text")
		.attr("class", "taipeiBoxText")
		.append("i")
		.attr("class", "fa fa-line-chart")
		.text(function(d) { return "  台北週末票房: " + d["台北週末"].toLocaleString(); })

	d3.selectAll(".totalBoxOffice")
		.data(data)
		.append("text")
		.attr("class", "totalBoxText")
		.append("i")
		.attr("class", "fa fa-bar-chart")
		.text(function(d) { return "  累積票房: " + d["累積新台幣"].toLocaleString(); });
 	
 	console.log(data[0]["上市"]);
	d3.selectAll(".debutDate")
		.data(data)
		.append("text")
		.attr("class", "debutDateText")
		.append("i")
		.attr("class", "fa fa-calendar")
		.text(function(d) { 
			if(d["上市"].length == 0)
				return "  上映日期: " + "無提供資料";
			else 
				return "  上映日期: " + d["上市"]; 
		});

	d3.selectAll(".weekCount")
		.data(data)
		.append("text")
		.attr("class", "weekCountText")
		.append("i")
		.attr("class", "fa fa-calendar-o  fa-1x")
		.text(function(d) { 
			if (d["周次"] == "" || isNaN(d["周次"]))
				return "上映周次: " + "無提供資料"; 
			else 
				return  "上映周次: " + d["周次"]; 
		});


	d3.selectAll(".imdbRate")
		.data(data)
		.append("text")
		.attr("class", "imdbRate")
		.append("i")
		.attr("class", "fa fa-check-circle")
		.text(function(d) { 
			if (d["IMDB"] == "N/A" || isNaN(d["IMDB"]) || d["IMDB"] == "undefined" || d["IMDB"] == "" )
				return "IMDb評分: 無提供資料";
			else 
				return "IMDb評分: " + d["IMDB"]; 
		});


	console.log(data[1]["IMDB_vote"]); 

	d3.selectAll(".imdbVote")
		.data(data)
		.append("text")
		.attr("class", "imdbVote")
		.append("i")
		.attr("class", "fa fa-user-plus")
		.text(function(d) { 
			if(d["IMDB_vote"] == "undefined" || d["IMDB_vote"] == "NaN")  { 
				 return " IMDb投票: 無提供資料"; 
			} 
			else {
			 	return " IMDb投票: " + d["IMDB_vote"];
			}
		});

	console.log(data); 
	attachVideos(data) 
}



function attachVideos(data) { 

	var videoSources = []; 

	for(var i = 0; i < data.length; i++) { 
		videoSources.push(data[i].Youtube); 
	}

	d3.selectAll(".video_child") 
		.data(videoSources)
		.append("iframe")
		.attr("width", 360)
		.attr("height", 355)
		.attr("allowfullscreen", true)
		.attr("controls", true)
		.attr("autoplay", true)
		.attr("src", function(d, i) { return "http://www.youtube.com/embed/" + videoSources[i];})

		drawGraph(data); 
}

function drawGraph(data) { 

	

	for (var i = 0; i < data.length; i++) { 
		data[i].IMDB_vote = parseInt(data[i].IMDB_vote.split(",").join("")); 
	}

	console.log(data);

	var margin = {top: 0, right: 0, bottom: 20, left: 60}; 
	var chartHeight = 300 - margin.top - margin.bottom; 
	var chartWidth = 360 - margin.left - margin.right; 

	var minXScale = d3.min(data, function(d) { return d.累積新台幣; }); 
	var maxXScale = d3.max(data, function(d) { return d.累積新台幣; }); 

	var xScale = d3.scale.pow().exponent(1/3)// total box office scale
		.domain([minXScale, maxXScale])
		.range([0, chartWidth]); 

	// var minXScale2 = d3.min(data, function(d) { return d.台北週末; }); 
	// var maxXScale2 = d3.max(data, function(d) { return d.台北週末; }); 

	// console.log(minXScale2); 
	// console.log(maxXScale2); 
	var xScale2 = d3.scale.pow().exponent(1/3) 
		.domain([0, 5000000])
		.range([0, chartWidth]); 

	var imdbVoteScale = d3.scale.linear()
		.domain([0, 20000])
		.range([0, chartWidth]);

	var imdbRateScale = d3.scale.linear() 
		.domain([0, 10])
		.range([0, 310]); 

	var yScale = d3.scale.ordinal() 
		.domain(["", "IMDb評分", "IMDb投票", "累積新台幣", "台北週末", ""])
		.range([chartHeight, chartHeight * 4/5, chartHeight * 3/5, chartHeight * 2/5, chartHeight * 1/5, 0]);

	var xAxis = d3.svg.axis() 
		.scale(xScale)
		.orient("bottom"); 

	var yAxis = d3.svg.axis() 
		.scale(yScale) 
		.orient("left")
		.ticks(6)
		.tickSize(0);

	d3.selectAll(".stats_child") 
		.data(data)
		.append("text") 
		.attr("class", "rankText") 
		.append("i")
		.attr("class", "fa fa-trophy fa-2x")
		.text(function(d) { return d.排名 + "    "; })

	d3.selectAll(".stats_child") 
		.data(data) 
		.append("text")
		.attr("class", "lastWeekRank")
		.append("i")
		.attr("class", function(d) { 
			if (d.排名 != d.上週) 
				return "fa fa-arrows-v fa-2x"; 
			else 
				return "fa fa-arrows-h fa-2x";
		})
		.text(function(d) { return d.上週; }); 

	d3.selectAll(".stats_child")
		.data(data) 
		.append("text") 
		.attr("class", "increaseAmount")
		.text(function(d) { 
			if(d.增率 != "*") 
				return "增率: " + d.增率; 
			else 
				return "增率: 無提供資料";
		});

	d3.selectAll(".stats_child")
		.append("svg")
		.attr("class", "svg_canvas")
		.attr("width", chartWidth +  margin.left + margin.right)
		.attr("height", chartHeight + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + ", 0)"); 

	d3.selectAll(".svg_canvas")
		.append("g") 
		.attr("class", "xAxis")
		.attr("transform", "translate(0, " + chartHeight + ")")
		.call(xAxis); 

	d3.selectAll(".svg_canvas")
		.append("g") 
		.attr("class", "yAxis")
		.attr("transform", "translate(" + 80 + ", 0)")
		.call(yAxis); 
	
	d3.selectAll(".svg_canvas")
		.data(data)
		.append("rect")
		.attr("class", "taipeiRect")
		.attr("x", 80)
		.attr("y", yScale("台北週末") - 20)
		.attr("width", function(d) { return xScale2(d.台北週末); })
		.attr("height", 40)
		.attr("fill", "#1f77b4")
		// .on("mouseover", tip.html(function(d) {return "<strong>台北週末票房:</strong> <span style='color:red'>" + d.台北週末 + "</span>"; }).show)
		// .on("mouseout", tip.hide); 
 
	d3.selectAll(".svg_canvas")
		.data(data)
		.append("rect")
		.attr("class", "taiwanRect")
		.attr("x", 80)
		.attr("y", yScale("累積新台幣") - 20)
		.attr("width", function(d) { return xScale(d.累積新台幣); })
		.attr("height", 40)
		.attr("fill", "#ff7f0e")
		// .on("mouseover", tip.html(function(d) {return "<strong>累積新台幣:</strong> <span style='color:red'>" + d.累積新台幣 + "</span>";}).show)
		// .on("mouseout", tip.hide); 

	d3.selectAll(".svg_canvas")
		.data(data)
		.append("rect")
		.attr("class", "imdbVote")
		.attr("x", 80)
		.attr("y", yScale("IMDb投票") - 20)
		.attr("width", function(d) { return imdbVoteScale(d.IMDB_vote); })
		.attr("height", 40)
		.attr("fill", "#2ca02c");
		// .on("mouseover", tip.html(function(d) {return "<strong>IMDB 評價人數:</strong> <span style='color:red'>" + d.IMDB_vote + "</span>";}).show)
		// .on("mouseout", tip.hide); 

	d3.selectAll(".svg_canvas")
		.data(data)
		.append("text")
		.attr("class", "rating")
		.attr("x", 90)
		.attr("y", yScale("IMDb評分") + 5)
		.text(function(d) { 
			if (d.IMDB == "" || isNaN(d.IMDB))
				return "無IMDb評分"; 
			else
				return d.IMDB + "/10"; 
		});
		// .on("mouseover", tip.html(function(d) {return "<strong>IMDB 評價:</strong> <span style='color:red'>" + d.IMDB + "</span>";}).show)
		// .on("mouseout", tip.hide); 



	// console.log(data); 

	// d3.selectAll(".stats")
	// 	.data(data)
	// 	.append("p")
	// 	.text(function(d) { return d.IMDB; });  

}


// d3.selectAll(".row")
	// 	.append("svg")
	// 	.attr("class", "svg_canvas");

	// d3.selectAll("row").append("div") 
	// 	.attr("class", "col-sm-4")
	// 	.append("div")
	// 	.attr("class", "well") 
	// 	.append("p")
	// 	.text("hello");

	// for (var i = 0; i < data.length; i++) { 
	// 	data[i].排名 = parseInt(data[i].排名);
	// }

 //   	data.sort(function(a, b) { return a.排名 - b.排名; })
 //   	console.log(data); 

	// var div = d3.select("#chart").selectAll("div")
	// 	.data(data)
	// 	.enter().append("div")
	// 	.attr("class", "col-sm-4");

