


var margin = { top: 20, right:80, bottom: 25, left: 50};

var width = $('.row').width() - 110;

if (width<700)
  width = 700;

var height = 400;


var x = d3.time.scale()
					.range([ 0, width]);

var y = d3.scale.linear()
					.range([ height-10, 0]);

var color = d3.scale.category10();



var yAxis = d3.svg.axis()
							.scale(y)
							.orient("left");

var line = d3.svg.line()
						.interpolate("step")
						.x( function (d, i){
							return x(i+1996);
						})
						.y(function (d){
  							return y(d);
						});
            

var svg = d3.select(".graph").append("svg")
					.attr("width", width + margin.left + margin.right )
					.attr("height", height + margin.top + margin.bottom )
				.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//input data
d3.json("data/data.json", function(data){
  
  category_combinations = data;
  
  console.log(category_combinations)

  var date_range = [];
  for(i = 1996; i < 2013; i++){
    date_range.push(i);
  }


  //put xAxis here to get good ticks
  var xAxis = d3.svg.axis()
              .scale(x)
              .orient('bottom')
              .tickValues(date_range)
              .tickFormat(d3.format("4.0f"))


  var cancer_type = [];
  for(i = 0; i < category_combinations.length; i++){
    if(cancer_type.indexOf(category_combinations[i][2]) <0)
      cancer_type.push(category_combinations[i][2]);
  }


  //cancer type form 
  d3.select('#form3')
    .append('form')
    .append('select')
    .attr("class", "ui dropdown")
    .attr('id', 'cancer_form')
    .selectAll('option')
    .data(cancer_type.reverse())
    .enter()
    .append('option')
    .text( function(d){
      return d;
    })


  //x axis
  x.domain([1995.8, date_range[date_range.length-1]]);

  svg.append("g")         //x axis
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append('text')
      .attr("id", "x_axis_label")
      .attr("x", width)
      .attr('y', -5)
      .style('text-anchor', 'end')
      .text('西元年');

  svg.append('g')         //y axis
      .attr('class', 'y axis')
      .call(yAxis)
    .append('text')
      .attr("id", "y_axis_label")
      .attr("x", 70)
      .attr('y', -5)
      .style('text-anchor', 'end')
      .text('發生率(人/每10萬人)');




  var cases;

  var  render_cancer_type = []; 

  function update_line(){

    svg.selectAll(".name")
        .remove();

    d3.select(".gender_form_remove")
      .remove();

    d3.select(".county_form_remove")
      .remove();

    var cancer_input = document.getElementById("cancer_form");
    var selected_cancer = cancer_input.options[cancer_input.selectedIndex].text;


    render_cancer_type = [];     //only render the selected cancer

    for(i = 0; i< category_combinations.length; i++){
      if( category_combinations[i][2] == selected_cancer){
        render_cancer_type.push(category_combinations[i]);
      }
    }


    var gender_type = [];

    for(i = 0; i < render_cancer_type.length; i++){
      if(gender_type.indexOf(render_cancer_type[i][0]) <0)
        gender_type.push(render_cancer_type[i][0]);

    }

    d3.select('#form1')
      .append('form')
      .attr("class", 'gender_form_remove')
      .append('select')
      .attr("class", "ui info dropdown")
      .attr('id', 'gender_form')
      .selectAll('option')
      .data(gender_type)  
      .enter()
      .append('option')
      .text( function(d){
        return d;
      })

    var sex_input = document.getElementById("gender_form");
    var selected_sex = sex_input.options[sex_input.selectedIndex].text;  


    var county_type = [];
    for(i = 0; i < render_cancer_type.length; i++){
      if(render_cancer_type[i][0] == selected_sex && render_cancer_type[i][2] == selected_cancer)
        county_type.push(render_cancer_type[i][1])
    }


    d3.select('#form2')
      .append('form')
      .attr("class",'county_form_remove')
      .append('select')
      .attr("class", "ui dropdown")
      .attr('id', 'county_form')
      .selectAll('option')
      .data(county_type)  
      .enter()
      .append('option')
      .text( function(d){
        return d;
      })



    //make case objects
    cases = render_cancer_type.map( function(d){    //data process completed
      return {
        name: d.slice(0,3).join("-"),
        values: d.slice(3, d.length)
      }
    });



    var recorded_color;
    var recorded_op;
    var recorded_width;


    var name = svg.selectAll(".name")
                .data(cases)
                .enter()
                .append("g")
                .attr("class", "name")
                

    name.append("path")
        .attr("class", "line")
        .style("stroke", "#1f77b4")
        .style("opacity", "0.2")
        .style("stroke-width", "3.5px")
        .on("mouseover", function(d){
          recorded_color = d3.select(this).style("stroke");
          recorded_op = d3.select(this).style("opacity");
          recorded_width = d3.select(this).style("stroke-width");
          
          d3.select(this)
            .style("stroke", "yellow")
            .style("opacity", "1")
            .style("stroke-width", "8px");

          d3.select('#gender').html('性別: '+ d.name.split('-')[0]);
          d3.select('#county').html('縣市: '+ d.name.split('-')[1]);
          d3.select('#cancer').html('癌症類別: '+ d.name.split('-')[2]);
          d3.select('#oldest_happen_rate').html('1996年: ' + d.values[0] + '人');

          var newest_year = 1993 + d.values.length+2;
          d3.select('#newest_happen_rate').html( newest_year + "年: " +d.values[d.values.length-1] + '人');

        })

        .on("mouseleave", function(){
          d3.select(this)
            .style("stroke", recorded_color)
            .style("opacity", recorded_op)
            .style("stroke-width", recorded_width);

          d3.select('#gender').html(null);
          d3.select('#county').html(null);
          d3.select('#cancer').html(null);
          d3.select('#oldest_happen_rate').html(null);
          d3.select('#newest_happen_rate').html(null);

        })


  };   //end of form change update






  function change_highlight(){



    var sex_input = document.getElementById("gender_form");
    var selected_sex = sex_input.options[sex_input.selectedIndex].text;

    var county_input = document.getElementById("county_form");
    var selected_county = county_input.options[county_input.selectedIndex].text;

    var cancer_input = document.getElementById("cancer_form");
    var selected_cancer = cancer_input.options[cancer_input.selectedIndex].text;

    var combined_input = selected_sex + "-"+ selected_county + "-" +selected_cancer;    //data user entered

    var result = $.grep(cases, function(e){ return e.name == combined_input; });

    
    d3.selectAll('.line')
      .style("stroke", "#1f77b4")
      .style("opacity", "0.2")
      .style("stroke-width", "2.5px");


    var max = d3.max(result[0].values)

    y.domain([0, max + max *0.3]);

    svg.select("g.y.axis")
        .call(yAxis)


    d3.selectAll(".line")                 //draw lines here
          .transition()
          .duration(800)
          .attr("id", function(d){
            return d.name;
          })

          .attr("d", function(d){
            return line(d.values);
          })
          .each("end", change_color);



    //highlight line
    function change_color(){ 
    
      d3.select("#"+combined_input)
        .each( function(d){
          
          d3.selectAll(".line").sort(function (a, b) { 
                if (a.name != d.name) return -1;               
                else return 1;                             
              });
        })
        .transition()
        .duration(500)
        .style('stroke', 'red')
        .style("opacity", "1")
        .style("stroke-width", "10px");
    }


    d3.select('#selected_gender').html('性別: '+selected_sex);
    d3.select('#selected_county').html('縣市: ' + selected_county);
    d3.select('#selected_cancer').html('癌症類別: ' +selected_cancer);

    var oldest_year_value = result[0].values[0];
    var newest_year_value = result[0].values[result[0].values.length-1];

    d3.select('#selected_oldest_happen_rate').html('1996年: ' + oldest_year_value + '人');

    var newest_year = 1993 + result[0].values.length+2;
    d3.select('#selected_newest_happen_rate').html( newest_year + "年: " +newest_year_value+ '人');

    if(oldest_year_value<newest_year_value)
      var change = "增加"
    else 
      var change = "下降"

    var change_percent = ((Math.abs(oldest_year_value - newest_year_value))/oldest_year_value * 100).toFixed(2)

    d3.select('#rate_text').html(newest_year-1996 + "年")
    d3.select("#rate_change").html(change + "了 "+ change_percent + "%")

  }


  function update_county_form(){
    d3.select(".county_form_remove")
      .remove();

    var cancer_input = document.getElementById("cancer_form");
    var selected_cancer = cancer_input.options[cancer_input.selectedIndex].text;


    var sex_input = document.getElementById("gender_form");
    var selected_sex = sex_input.options[sex_input.selectedIndex].text;  

    var county_type = [];
    for(i = 0; i < render_cancer_type.length; i++){
      if(render_cancer_type[i][0] == selected_sex && render_cancer_type[i][2] == selected_cancer)
        county_type.push(render_cancer_type[i][1])
    }


    d3.select('#form2')
      .append('form')
      .attr("class",'county_form_remove')
      .append('select')
      .attr("class", "ui dropdown")
      .attr('id', 'county_form')
      .selectAll('option')
      .data(county_type)  
      .enter()
      .append('option')
      .text( function(d){
        return d;
      })

  }

  //initial 
  update_line();
  change_highlight();

  d3.select('#form3').on('change', function(){
    update_line();
    change_highlight();
  });


  d3.select('#form1').on('change', function(){
    update_county_form();
    change_highlight();
    
  });

  d3.select('#form2').on('change', function(){
    change_highlight();
  });





}) //data file close









