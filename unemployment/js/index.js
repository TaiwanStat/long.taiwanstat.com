


var Svg_Width = 640;
var Svg_Height = 730;

var color_array =['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f','#b30000', '#7f0000'];


var color = d3.scale.quantize()
                .domain([0, 1])
                .range(d3.range(9).map(function(d) { return color_array[d] }));

var svg = d3.select(".tw_map_svg")
                .append("svg")
                .attr("width", Svg_Width)
                .attr("height", Svg_Height);

var projection = d3.geo.mercator().center([121.175531, 24.01000]).scale(10000);

var path = d3.geo.path()
            .projection(projection);


var current_year = 1993;


var tip = d3.tip()
           .attr('class', 'd3-tip')
           .offset([-10, 0])
           .html(function(d) {
                return d.properties.name + " " 
                + current_year 
                + "年失業率: " 
                + d.properties.value[current_year-1993] + "%";
           })


svg.call(tip);


d3.csv('data/tw_data1.csv', function(tw_data1){
d3.json('data/twCounty2011merge.topo.json', function(error, tw_topo_data) {
d3.xml("data/pie_data1.xml",function(pie_data1){     //pie chart
d3.csv("data/line_data1.csv", function(line_data1){


    //processing map section ////////////////////

    d3.select('#curr_year').html("西元 "+current_year + ' 年台灣失業數據')  //first declare year 

    var topo = topojson.feature(tw_topo_data, tw_topo_data.objects["layer1"]);

    var topomesh = topojson.mesh(tw_topo_data, tw_topo_data.objects["layer1"], function(a, b){
        return a !== b;
    });

    // render them on a svg element with id "map"
    var blocks = svg.selectAll("path")
                .data(topo.features)
                .enter()
                .append("path")
                .attr("d",path)
                .attr("opacity", 0.8)
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);


    svg.append('path')
        .attr('class', "borders")
        .datum(topomesh)
        .attr('d', path)
        .style('fill', 'none')
        .style('stroke', "rgba(255,255,255,0.5)")
        .style('stroke-width', '2px')


    //get max value in the data
    var county_data = [];
    for(k = 0; k < tw_data1.length; k++){
        Object.keys(tw_data1[k]).forEach(function(n, i) {
            if(n !== '資料時期')
                county_data.push(tw_data1[k][n]);
        })
    }
        
    // create a color map from population number
    colorMap = d3.scale.linear()
                .domain([0, d3.max(county_data)]);

    //get data year range
    var year_range = [];
    for( i = 0; i < tw_data1.length; i++){
        year_range.push(tw_data1[i]['資料時期'])
    }


    //attach value on map 
    for(i = 0; i < topo.features.length; i ++ ) {
        var County_Name = topo.features[i].properties.name;
        var Column_County_Data = []
        for(j = 0; j < tw_data1.length; j++){
            Column_County_Data.push(tw_data1[j][County_Name])
        }
        topo.features[i].properties.value = Column_County_Data; //add county column as array
    }


    //try to get top 3 
    var unemployment_by_year = [];

    for (i = 0; i < topo.features[0].properties.value.length; i++){
        var temp = [];

        for( j = 0; j < topo.features.length; j++){    
            var county_name_and_rate =[];
            county_name_and_rate.push(topo.features[j].properties.name);
            county_name_and_rate.push(topo.features[j].properties.value[i]);
            temp.push(county_name_and_rate);
        };
        unemployment_by_year.push(temp);
    };


    var top3s_each_year = [];

    for(m = 0; m< unemployment_by_year.length; m++){
        var temp = [];
        for(k = 0; k <3; k++){
            var max = -1;
            var index;
            for(i = 0; i < unemployment_by_year[m].length; i++){
                
                if(unemployment_by_year[m][i][1]>max){
                    max = unemployment_by_year[m][i][1];
                    index = i;
                }
            }

            temp.push(unemployment_by_year[m][index]);
            unemployment_by_year[m].splice(index, 1)
        }
        top3s_each_year.push(temp);
    }

    

    // fill each path with 1993 data color
    blocks.style("fill",function(it){ 
        return color(colorMap(it.properties.value[0]));
    });


    //generate top 3 rect
    var top3_rect = svg.selectAll("rect")
        .data(top3s_each_year[0])
        .enter()
        .append("rect")
        .attr("x", function() {
            return 280;
        })
        .attr("y", function(d, i){
            return 30 + i*30;
        })
        .attr("width", 35)
        .attr("height", 28)
        .attr("fill", function(d){
            return color(colorMap(d[1]));
        })
        .attr("opacity", 0.8);


    //generate top 3 text
    var top3_text = svg.selectAll("text")
                    .data(top3s_each_year[0])
                    .enter()
                    .append("text")
                    .attr("class", "rank_text")
                    .text(function(d, i){
                        if(i == 0)
                            var rank = "失業率第ㄧ高: "
                        if(i == 1)
                            var rank = "失業率第二高: "
                        if(i == 2)
                            var rank = "失業率第三高: "
                        return rank +d[0]+ " " + d[1] + "% ";
                    })
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "20px")
                    .attr("fill", "black")
                    .attr("background-color", "red")
                    .attr("x", function() {
                        return 30;
                    })
                    .attr("y", function(d, i){
                        return 50 + i*30;
                    });

    //processing map section ends////////////////////




    //pie chart data processing section/////////////

    var child_nodes = pie_data1.documentElement.getElementsByTagName('失業人數').item(0).childNodes;

    var data2_by_cat = [];

    for(i= 0; i < child_nodes.length; i++){
        var temp = [];
        if(child_nodes[i].nodeType ==1){
            if(child_nodes[i].nodeName != '國中及以下' && child_nodes[i].nodeName != '高中_職' && child_nodes[i].nodeName != '大專及以上'){      //ignore useless tags
                temp.push(child_nodes[i].nodeName);     //get all tag names
                data2_by_cat.push(temp);       //store into 2D array
            }
        }
    }

    //get data for all tags
    for( k = 0; k< data2_by_cat.length; k++){
        var tag_name = data2_by_cat[k][0];
        var xml_tag_element = pie_data1.documentElement.getElementsByTagName(tag_name);

        for(i = 0; i < xml_tag_element.length; i++){
            data2_by_cat[k].push(+xml_tag_element.item(i).childNodes[0].nodeValue);  //get all data according to tags
        }
    }
    //finish reading xml data


    var curr_year = 1993;   //center control of year


    var year_to_data_index = curr_year-1992;

    d3.select('#total_pop_unemployed').html('總計失業人數: '+data2_by_cat[1][year_to_data_index]*1000+ '人');

    var year_data = [];
    for(i = 2; i < data2_by_cat.length; i++){   //start from 2 because don't want year and total
        var temp = [];

        temp.push(data2_by_cat[i][0], data2_by_cat[i][year_to_data_index]);  //change data2_by_cat[i][1] to get different years
        year_data.push(temp);
    }


    var year_data_gender = year_data.slice(0,2);
    var year_data_age = year_data.slice(2, 13);
    var year_data_education = year_data.slice(13, year_data.length);




    //first pie chart
    var chart1 = c3.generate({
        bindto: '#pie_chart1',
        data: {
            columns: year_data_gender,
            type: 'pie'
        },
        transition:{
            duration:1000
        },
        tooltip:{
            format:{
                title: function(d){ 
                    return '失業人數';
                },
                value: function(value){
                    return value*1000+ '人';
                }

            }
        },
        size:{
            height: 250,
            width: 250
        },

    });


    //second pie chart
    var chart2 = c3.generate({
        bindto: '#pie_chart2',
        data: {
            columns: year_data_age,
            type: 'pie'
        },
        tooltip:{
            format:{
                title: function(d){ 
                    return '失業人數';
                },
                value: function(value){
                    return value*1000+ '人';
                }

            }
        },
        size:{
            height: 300,
            width: 450
        },

    });

    //third pie chart
    var chart3 = c3.generate({
        bindto: '#pie_chart3',
        data: {
            columns: year_data_education,
            type: 'pie'
        },
        tooltip:{
            format:{
                title: function(d){ 
                    return '失業人數';
                },
                value: function(value){
                    return value*1000+ '人';
                }

            }
        },
        size:{
            height: 250,
            width: 310
        },

    });

    function update_data(curr_year){
        var year_to_data_index = curr_year-1992;

        d3.select('#total_pop_unemployed').html('總計失業人數: '+data2_by_cat[1][year_to_data_index]*1000 + '人');

        var year_data = [];
        for(i = 2; i < data2_by_cat.length; i++){   //start from 2 because don't want year and total
            var temp = [];

            temp.push(data2_by_cat[i][0], data2_by_cat[i][year_to_data_index]);  //change data2_by_cat[i][1] to get different years
            year_data.push(temp);           //make [tag, year_data] pair
        }


        var year_data_gender = year_data.slice(0,2);
        var year_data_age = year_data.slice(2, 13);
        var year_data_education = year_data.slice(13, year_data.length);

        //first pie chart
        chart1.load({
            columns: year_data_gender
        });

        //second pie chart
        chart2.load({
            columns: year_data_age
        });

        //second pie chart
        chart3.load({
            columns: year_data_education
        });

    }

    //pie chart processing section ends////////////////



    //line chart processing section/////////////////

    var line_data1_by_cat = [];  //main 2D array for line_data1, with every element a category

    var keys = [];
    for (var key in line_data1[0]) {
        keys.push(key);
    }

    for(i = 0; i < keys.length; i++){
        var temp = [];
        temp.push(keys[i]);
        line_data1_by_cat.push(temp); //get all the pop categories
    }

    //get all the data for each cate
    for(j = 0; j < line_data1_by_cat.length; j++){
        var category_name = line_data1_by_cat[j][0];

        for(i = 0; i < line_data1.length; i++){
            
            var value = line_data1[i][category_name];
            line_data1_by_cat[j].push(+value);
        }
    }

    //write total unemployment rate
    d3.select("#total_unemployment_rate").html("失業率: "+ line_data1_by_cat[1][1]+ "%");

    var line_chart = c3.generate({
        bindto: '#line_chart',
        data: {
            x: '資料時期',
            columns: line_data1_by_cat
        },
        zoom: {
            enabled: true
        },
        axis:{
            x:{
                show: true,
                label:{
                    text: '西元年',
                    position: 'outer-middle'
                },
                tick:{
                    culling:{
                        max:24,
                    },
                },
                padding: {
                    right:0.5,
                }
            },
            y:{
                label:{
                    text: '失業率',
                    position: 'outer-middle'
                },
                tick:{
                    format: function (d){ return d+"%"}
                }
            }
        },
        tooltip:{
            format:{

                title: function(d){ 
                    return '西元' + d + '年';
                },
                value: function(value){
                    var format = d3.format("2.1f");
                    return format(value)+"%";
                }

            }
        },
        size: {
            height:400,
            width:1160
        },
        color: {
            pattern: ['rgb(44, 160, 44)', 'rgb(31, 119, 180)', 'rgb(214, 39, 40)', 'rgb(255, 127, 14)', 'rgb(255, 127, 14)', 'rgb(255, 127, 14)', 'rgb(255, 127, 14)', 'rgb(255, 127, 14)', 'rgb(255, 127, 14)', 'rgb(255, 127, 14)', 'rgb(255, 127, 14)', 'rgb(255, 127, 14)', 'rgb(255, 127, 14)', 'rgb(255, 127, 14)', 'rgb(23, 190, 207)', 'rgb(23, 190, 207)', 'rgb(23, 190, 207)', 'rgb(23, 190, 207)', 'rgb(23, 190, 207)', 'rgb(23, 190, 207)', 'rgb(23, 190, 207)', 'rgb(23, 190, 207)', 'rgb(23, 190, 207)']
        }
        // rgb(255, 127, 14) orange
        // rgb(31, 119, 180) blue
        // rgb(214, 39, 40) red
        // rgb(44, 160, 44) green
        // rgb(23, 190, 207) light blue

    });
    

    var gender_cat_array, age_cat_array, education_cat_array;

    gender_cat_array = keys.slice(2,4);
    age_cat_array = keys.slice(4, 15);
    education_cat_array = keys.slice(15, keys.length);

    var gender_show = true;
    var age_show = true;
    var education_show = true;

    d3.select("#gender_button").on("click", function(){
        if(gender_show){   //hide data
            line_chart.hide(gender_cat_array ,{
                withLegend: true
            });
            d3.select("#gender_button").text("顯示性別資料");
            gender_show = false;
        }else{                 //show data
            line_chart.show(gender_cat_array, {
                withLegend: true
            });

            d3.select("#gender_button").text("隱藏性別資料");
            gender_show = true;
        } 
    })

    d3.select("#age_button").on("click", function(){
        if(age_show){
            line_chart.hide(age_cat_array,{
                withLegend: true
            });
            d3.select("#age_button").text("顯示年齡資料");
            age_show = false;
        }else{
            line_chart.show(age_cat_array, {
                withLegend: true
            });
            d3.select("#age_button").text("隱藏年齡資料");
            age_show = true;
        } 
    })

    d3.select("#education_button").on("click", function(){
        if(education_show){
            line_chart.hide(education_cat_array,{
                withLegend: true
            });
            d3.select("#education_button").text("顯示學歷資料");
            education_show = false;
        }else{
            line_chart.show(education_cat_array, {
                withLegend: true
            });
            d3.select("#education_button").text("隱藏學歷資料");
            education_show = true;
        } 
    })

    var transform_bar = false;

    d3.select("#transform_bar").on("click", function(){
        if(!transform_bar){
            line_chart.transform('bar');
            d3.select("#transform_bar").text("以直線圖顯示");
            transform_bar = true;
        }else{
            line_chart.transform('line');
            d3.select("#transform_bar").text("以長條圖顯示");
            transform_bar = false;
        } 
    })

    //line chart section ends///////




    //animation processing section //////////
    //make year buttons
    var buttons = d3.select(".button_role")
                        .selectAll("div")
                        .data(year_range)
                        .enter()
                        .append("button")
                        .attr("class", "ui button year_button")
                        .style("background", function(d){
                            return color(colorMap(line_data1_by_cat[1][d-1992]));
                        })
                        .text(function(d){
                            return d;
                        })
                        .attr("id", function(d){
                            return "button"+d;
                        })


    d3.select('#button' +1993)
        .transition()
        .duration(300)
        .style("background", "#3b83c0")



    //button animation
    buttons.on("click", function(selected_year){

        d3.selectAll(".year_button")
            .transition()
            .duration(200)
            .style("background", function(d){
                return color(colorMap(line_data1_by_cat[1][d-1992]));
            });

        d3.select(this)
          .transition()
          .duration(200)
          .style("background", "#3b83c0");



        //update year
        current_year = selected_year;

        //update total info
        d3.select('#curr_year').html("西元 "+current_year +" 年台灣失業數據")
        d3.select("#total_unemployment_rate").html("失業率: "+ line_data1_by_cat[1][current_year-1992]+ "%");

        //update path color
        svg.selectAll("path")
            .data(topo.features)
            .transition()
            .duration(400)
            .style("fill",function(it){ 
                return color(colorMap(it.properties.value[current_year-1993]));
            });

        top3_rect = d3.selectAll("rect")
                    .data(top3s_each_year[current_year-1993])
                    .transition()
                    .duration(400)
                    .attr("fill", function(d){
                        return color(colorMap(d[1]));
                    })
                    .attr("opacity", 0.8);


        top3_text = d3.selectAll("text")
            .data(top3s_each_year[current_year-1993])
            .transition()
            .duration(400)
            .text(function(d, i){
                if(i == 0)
                    var rank = "失業率第一高: "
                if(i == 1)
                    var rank = "失業率第二高: "
                if(i == 2)
                    var rank = "失業率第三高: "
                return rank +d[0]+ " " + d[1] + "%";
            });


        //update pie chart
        update_data(selected_year);

    })



    //play animation function
    d3.select("#play_button").on("click", function(){

        $("#play_button").hide();
        var count_year = 0;

        var set_switch = setInterval(function() {

            if(count_year == tw_data1.length -1 ) {
                clearInterval(set_switch);
                $("#play_button").show();
            }

            d3.select('#curr_year').html("西元 "+year_range[count_year] + " 年台灣失業數據")
            d3.select("#total_unemployment_rate").html("失業率: "+ line_data1_by_cat[1][count_year+1]+ "%");


            d3.selectAll(".year_button")
                        .transition()
                        .duration(200)
                        .style("background", function(d){
                            return color(colorMap(line_data1_by_cat[1][d-1992]));
                        });

            var actual_year = count_year+1993;

            d3.select('#button' + actual_year)
              .transition()
              .duration(200)
              .style("background", "#3b83c0");


            top3_rect = d3.selectAll("rect")
                            .data(top3s_each_year[count_year])
                            .transition()
                            .duration(200)
                            .attr("fill", function(d){
                                return color(colorMap(d[1]));
                            })
                            .attr("opacity", 0.8);

            top3_text = d3.selectAll("text")
                        .data(top3s_each_year[count_year])
                        .transition()
                        .duration(200)
                        .text(function(d, i){
                            if(i == 0)
                                var rank = "失業率第一高: "
                            if(i == 1)
                                var rank = "失業率第二高: "
                            if(i == 2)
                                var rank = "失業率第三高: "
                            return rank +d[0]+ " " + d[1] + "%";
                        });


            svg.selectAll("path")
                .data(topo.features)
                .transition()
                .duration(200)
                .style("fill",function(it){ 
                    return color(colorMap(it.properties.value[count_year]));
                });


            //update pie chart
            update_data(actual_year);

            //update line chart
            var animation_data_array = [];
            for(i = 1; i < line_data1_by_cat.length; i++){
                temp = line_data1_by_cat[i].slice(0, count_year+2);
                animation_data_array.push(temp);    
            }

            line_chart.load({
                    columns: animation_data_array
                })


            count_year++;

        }, 1500)


    });


});
});
});
});





