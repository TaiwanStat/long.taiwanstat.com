     

     d3.csv("./database/donutdata.csv", function (error, dataset) {

         if (error) throw error;
         var country = [],
             type = [],
             item3k = [],
             itemcare = [];
         var country_data = [];
         var type_data = [];
         var item3k_data = [];
         var itemcare_data = [];
         for (var i = 0; i < 16; i++) {
             country = [];
             type = [];
             item3k = [];
             itemcare = [];
             country.push(dataset[i].印尼, dataset[i].菲律賓, dataset[i].泰國, dataset[i].越南, dataset[i].其他);
             type.push(dataset[i].Industrial_labor, dataset[i].caregiver);
             item3k.push(dataset[i].threek, dataset[i].ind);
             itemcare.push(dataset[i].看護工, dataset[i].care);

             country_data[i] = country;
             type_data[i] = type;
             item3k_data[i] = item3k;
             itemcare_data[i] = itemcare;
         }
         console.log(country_data);
         var width = 400,
             height = 250,
             cwidth = 25,
             offsetX = 20;


         var pie = d3.layout.pie()
             .sort(null);

         var arc = d3.svg.arc();

         var svg1 = d3.select("#country_from").append("svg")
             .attr("width", width)
             .attr("height", height)
             .append("g")
             .attr("transform", "translate(" + width / 2 + "," + height * 4 / 7 + ")");

         var gs1 = svg1.selectAll("g").data(d3.values(country_data)).enter().append("g");
         var color1 = ["#64363C", '#BEC23F', "#FFB11B", "#F596AA"];
         var path1 = gs1.selectAll("path")
             .data(function (d) {
                 return pie(d);
             })
             .enter().append("path")
             .attr("fill", function (d, i) {
                 return color1[i];
             })
             .attr("stroke", "#ffffff")
             .transition().duration(250)
             .attr("d", function (d, i, j) {
                 if (j == 15) return arc.innerRadius(60).outerRadius(90)(d)
             });



         var width2 = 250;
         var height2 = 200;
         var svg2 = d3.select("#donut_work").append("svg")
             .attr("width", width2)
             .attr("height", height2)
             .append("g")
             .attr("transform", "translate(" + width2 / 2 + "," + height2 / 2 + ")");


         var gs2 = svg2.selectAll("g").data(d3.values(type_data)).enter().append("g");

         var path2 = gs2.selectAll("path")
             .data(function (d) {
                 return pie(d);
             })
             .enter().append("path")
             .attr("fill", function (d, i) {
                 if (i < 2) return color1[i];
             })
             .attr("stroke", "#ffffff")
             .attr("d", function (d, i, j) {
                 if (j == 15) return arc.innerRadius(60).outerRadius(90)(d)
             })

         var svg3 = d3.select("#donut_threek").append("svg")
             .attr("width", width2)
             .attr("height", height2)
             .append("g")
             .attr("transform", "translate(" + width2 / 2 + "," + height2 / 2 + ")");



         var gs3 = svg3.selectAll("g").data(d3.values(item3k_data)).enter().append("g");
         var color2 = ["#64363C", "#D7C4BB"];
         var path3 = gs3.selectAll("path")
             .data(function (d) {
                 return pie(d);
             })
             .enter().append("path")
             .attr("fill", function (d, i) {
                 return color2[i];
             })
             .attr("d", function (d, i, j) {
                 if (j == 15) return arc.innerRadius(60).outerRadius(90)(d)
             })
         svg3.append("text").text("產業外勞從事3k行業比例")
             .attr("transform", "translate(-90,0)")
             .attr({
                 "font-size": "1vw",
                 "font-weight": "bold",
                 "font-family": "'Noto Sans TC', sans-serif"
             });
         var svg4 = d3.select("#donut_care").append("svg")
             .attr("width", width2)
             .attr("height", height2)
             .append("g")
             .attr("transform", "translate(" + width2 / 2 + "," + height2 / 2 + ")");


         var gs4 = svg4.selectAll("g").data(d3.values(itemcare_data)).enter().append("g");
         var color3 = ["#FFB11B", "#FAF9B6"];
         var path4 = gs4.selectAll("path")
             .data(function (d) {
                 return pie(d);
             })
             .enter().append("path")
             .attr("fill", function (d, i) {
                 return color3[i];
             })
             .attr("d", function (d, i, j) {
                 if (j == 15) return arc.innerRadius(60).outerRadius(90)(d)
             })
         svg4.append("text").text("社福外勞從事看護工比例")
             .attr("transform", "translate(-90,0)")
             .attr({
                 "font-size": "1vw",
                 "font-weight": "bold",
                 "font-family": "'Noto Sans TC', sans-serif"

             });
         /*圖例*/
         var width_legend = 300,
             height_legend = 90;
         var legend_from = d3.select("#country_from").append("svg").attr("width", width_legend).attr("height", height_legend);
         var g_legend = legend_from.append("g");
         var text_from = ["印尼", "菲律賓", "泰國", "越南"];
         var text_ind = ["產業外勞", "社福外勞"];
         g_legend.selectAll("g")
             .data(country_data)
             .enter()
             .append("rect")
             .attr('width', 10)
             .attr("height", 10)
             .attr("fill", function (d, i) {
                
                 if (i < 4)
                     return color1[i];
                 else if (i < 6)
                     return color1[i - 4];
             })
             .attr("transform", function (d, i) {
                 if (i < 4)
                     return "translate(0," + (5 + 20 * i) + ")";
                 else if (i < 6)
                     return "translate(220," + (5 + 20 * (i - 4)) + ")";
             })
             .attr('id',function(d,i){
                 return 'legend'+i;
             })
             .attr('visibility', function (d, i) {
                 if (i > 3) return 'hidden';
             });
         g_legend.selectAll("g")
             .data(country_data)
             .enter()
             .append("text")
             .attr('width', 100)
             .attr("height", 80)
             .text(function (d, i) {
                 if (i < 4)
                     return text_from[i];
                 /* else if(i<6)
                return  text_ind[i-4] ;*/
             })
             .attr("transform", function (d, i) {
                 if (i < 4)
                     return "translate(25," + (14 + 20 * i) + ")"
                 else if (i < 6)
                     return "translate(250," + (14 + 18 * (i - 4)) + ")";
             })
             .attr('id',function(d,i){
                return 'legend'+i;
            })
             .attr({
                 "font-size": "1vw",
                 "font-weight": "bold"
             });

         

             /*TimeLine*/
             //append svg,g and set size
             var svgTime = d3.select("#timeLine").append('svg');
             svgTime = d3.select("#timeLine").select('svg').attr({
                 'width': 80,
                 'height': 500
             });
             var TimeLine = svgTime.append('g');

             //year
             TimeLine.selectAll('text')
                 .data(dataset)
                 .enter()
                 .append('text')
                 .text(function (d) {
                     return d.年分;
                 })
                 .attr({
                     'x': 30,
                     'y': function (d, i) {
                         return (20 + (i + 1) * 30)
                     },
                     'fill': "gray",
                     'font-size': '1vw',
                     'font-weight': 'bold',
                     'font-family': "'Inconsolata', monospace"
                 });
            var religion = [];
          
            religion.push("<font size=22>印尼</font><br>伊斯蘭教<br>可能每日要求祈禱數次<br>不吃豬肉、齋戒月白天禁水禁食","<font size=22>菲律賓</font><br>天主教<br>星期日可能要求去教堂","<font size=22>泰國</font><br>佛教","<font size=22>越南</font><br>佛教");
             //逐年變動
             TimeLine.selectAll('text')
                 .on('mouseover', function (d, i) {
                     d3.selectAll("text").attr({
                        'font-size': "1vw",
                    });
                     //bigger circle
                     d3.select(this).attr({
                         'font-size': "1.5vw",
                     });
                     svg1.selectAll("g").selectAll("path")
                         .transition().duration(20000).ease('poly', '3')
                         .attr("d", function (d, i1, j) {
                             if (j == i) {
                                 return arc.innerRadius(60).outerRadius(90)(d);
                             }
                         });
                     gs2.selectAll("path")
                         .transition().duration(20000).ease('poly', '3')
                         .attr("fill", function (d, i) {
                             return color1[i];
                         })
                         .attr("d", function (d, i1, j) {
                             if (j == i) return arc.innerRadius(60).outerRadius(90)(d);
                         });
                     gs3.selectAll("path")
                         .transition().ease('poly', '2')
                         .attr("fill", function (d, i) {
                             return color2[i];
                         })
                         .attr("d", function (d, i1, j) {
                             if (j == i) return arc.innerRadius(60).outerRadius(90)(d);
                         });
                     gs4.selectAll("path")
                         .transition().ease('poly', '2')
                         .attr("fill", function (d, i) {
                             return color3[i];
                         })
                         .attr("d", function (d, i1, j) {
                             if (j == i) return arc.innerRadius(60).outerRadius(90)(d);
                         });



                 })
                 .on('mouseout', function (d, i) {
                     
                     svg1.selectAll("g").selectAll("path").on("mouseover", function (d, i, j) {
                         d3.selectAll("path").attr("opacity", 0.7);
                         $("#religion").html(religion[i]);
                         d3.select(this).attr("opacity", 1).attr("d", function (d) {
                             return arc.innerRadius(60).outerRadius(95)(d);
                         })
                         g_legend.selectAll('rect').attr("opacity", 0.7);
                         g_legend.selectAll('text').attr("opacity", 0.7);
                         g_legend.selectAll('#legend'+i).attr("opacity", 1);
                         g_legend.selectAll('#legend'+i).attr("opacity", 1);

                     }).on("mouseout", function (d, i1, j1) {
                         d3.selectAll("path").attr("opacity", 1);
                         d3.select(this).attr("d", function (d, i, j) {
                             return arc.innerRadius(60).outerRadius(90)(d);
                         })
                     });
                     gs2.selectAll("path").on("mouseover", function (d, i, j) {
                         d3.select(this).attr("d", function (d, i, j) {
                             return arc.innerRadius(60).outerRadius(95)(d);
                         })
                     }).on("mouseout", function (d, i, j) {
                         d3.select(this).attr("d", function (d, i, j) {
                             return arc.innerRadius(60).outerRadius(90)(d);
                         })
                     });
                     gs3.selectAll("path").on("mouseover", function (d, i, j) {
                         d3.select(this).attr("d", function (d, i, j) {
                             return arc.innerRadius(60).outerRadius(95)(d);
                         })
                     }).on("mouseout", function (d, i, j) {
                         d3.select(this).attr("d", function (d, i, j) {
                             return arc.innerRadius(60).outerRadius(90)(d);
                         })
                     });
                     gs4.selectAll("path").on("mouseover", function (d, i, j) {
                         d3.select(this).attr("d", function (d, i, j) {
                             return arc.innerRadius(60).outerRadius(95)(d);
                         })
                     }).on("mouseout", function (d, i, j) {
                         d3.select(this).attr("d", function (d, i, j) {
                             return arc.innerRadius(60).outerRadius(90)(d);
                         })
                     });

                 });
             svg1.selectAll("g").selectAll("path").on("mouseover", function (d, i, j) {
                $("#religion").html(religion[i]);
                g_legend.selectAll('rect').attr("opacity", 0.7);
                g_legend.selectAll('text').attr("opacity", 0.7);
                g_legend.selectAll('#legend'+i).attr("opacity", 1);
                g_legend.selectAll('#legend'+i).attr("opacity", 1);
                 d3.selectAll("path").attr("opacity", 0.7);
                 d3.select(this).attr("opacity", 1).attr("d", function (d, i, j) {
                     return arc.innerRadius(60).outerRadius(95)(d);
                 })
             }).on("mouseout", function (d, i, j) {
                 d3.selectAll("path").attr("opacity", 1);
                 d3.select(this).attr("d", function (d, i, j) {
                     return arc.innerRadius(60).outerRadius(90)(d);
                 })
             });
             gs2.selectAll("path").on("mouseover", function (d, i, j) {
                 d3.select(this).attr("d", function (d, i, j) {
                     return arc.innerRadius(60).outerRadius(95)(d);
                 })
             }).on("mouseout", function (d, i, j) {
                 d3.select(this).attr("d", function (d, i, j) {
                     return arc.innerRadius(60).outerRadius(90)(d);
                 })
             });
             gs3.selectAll("path").on("mouseover", function (d, i, j) {
                 d3.select(this).attr("d", function (d, i, j) {
                     return arc.innerRadius(60).outerRadius(95)(d);
                 })
             }).on("mouseout", function (d, i, j) {
                 d3.select(this).attr("d", function (d, i, j) {
                     return arc.innerRadius(60).outerRadius(90)(d);
                 })
             });
             gs4.selectAll("path").on("mouseover", function (d, i, j) {
                 d3.select(this).attr("d", function (d, i, j) {
                     return arc.innerRadius(60).outerRadius(95)(d);
                 })
             }).on("mouseout", function (d, i, j) {
                 d3.select(this).attr("d", function (d, i, j) {
                     return arc.innerRadius(60).outerRadius(90)(d);
                 })
             });

         });


     $(function() {
        $(window).scroll(function() {
            var scrollVal = $(this).scrollTop();
            console.log(scrollVal);
            if ((scrollVal > 1780 && scrollVal<2000)||(scrollVal > 2290 && scrollVal<2500)) {
                $('#timeLine').css('visibility', 'visible');
            } else {
                $('#timeLine').css('visibility', 'hidden');
            }
        });
    });
    