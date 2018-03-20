var margin = {
        top: 50,
        left: 50,
        right: 50,
        bottom: 50
    },
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;



var datapath = "./data.csv"
d3.csv(datapath,function(dataset){
    var svg = d3.select('#map1')
    .append('svg')
    .attr('height', '100%')
    .attr('width','100%')
    .attr('transform', 'translate(0,0)')

    var color = d3.scale.linear().domain([200,1600]).range(["#FFFFFF","#003377"]);
    //var fisheye = d3.fisheye.circular().radius(100).distortion(2);  
    /*var zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);

    function zoomed() {
        map.attr("transform",
            "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }*/

    var features = topojson.feature(topodata, topodata.objects.COUNTY_MOI_1060525).features;

    var projection = d3.geo.mercator().center([122.5, 23.5]).scale(5000);
    var path = d3.geo.path().projection(projection);
    var temp = 0;

    for(var i=features.length - 1; i >= 0; i-- ) {
        for(var j=features.length - 1; j >= 0; j-- ){
            if(dataset[j].county == features[i].properties.COUNTYNAME){     
                temp++;
                features[i].properties.density = dataset[j].serve;
                features[i].properties.doctor = dataset[j].doctor;
                features[i].properties.population = dataset[j].population;
                features[i].properties.rank = dataset[j].rank;
                features[i].properties.rank2 = dataset[j].rank2;
                features[i].properties.bed = dataset[j].bed;
                features[i].properties.average = dataset[j].average;

            }
        }
    }
    var map = svg.append('g')
        .attr('transform', 'translate(-100,0)')
        //.call(zoom)
        .selectAll('.county')
        .data(features)
        .enter()
        .append("path")
        .attr('class', 'county')
        .attr('d', path)
        .attr('fill', function (d, i) {
            return color(d.properties.density);
        })
        .on("click", function (d) {

            d3.select(this).style('stroke-width', '2');
            d3.select(this).style('stroke', '#FB7F7F');
            $("#countyname").text(d.properties.COUNTYNAME);
            $("#population").text("人口數量 : "+d.properties.population+"人");
            $("#doctor")    .text("醫師數量 : "+d.properties.doctor+"人");
            $("#servenum")     .text(d.properties.density+"人");
            $("#ranknum").text(d.properties.rank+"/22");
        })
        .on("mouseover", function (d) {
            d3.select(this).style('stroke-width', '2');
            d3.select(this).style('stroke', '#FB7F7F');
        })
        .on("mouseout", function (d) {
            d3.select(this).style('stroke-width', '0');
            d3.select(this).style('stroke', '#C6C6C6');
            
        })
            //
    d3.select('button:nth-child(2)').on('click', function () {
        color = d3.scale.linear().domain([200,1600]).range(["#FFFFFF","#003377"]);
        $("#countyname")    .text("臺北市");
        $("#population")    .text("人口數量 : 2695704人");
        $("#doctor")    .text("醫師數量 : 9719人");
        $("#serve")    .text("每位醫生服務人數");
        $("#servenum")    .text("277.36人");
        $("#ranknum").text("1/22");
        d3.selectAll('.county')
        .data(features)
        .attr('fill', function (d) {
                return color(d.properties.density);
        })
        .on("click", function (d) {
            d3.select(this).style('stroke-width', '2');
            d3.select(this).style('stroke', '#FB7F7F');
            $("#countyname").text(d.properties.COUNTYNAME);
            $("#population").text("人口數量 : "+d.properties.population+"人");
            $("#doctor")    .text("醫師數量 : "+d.properties.doctor+"人");
            $("#servenum")     .text(d.properties.density+"人");
            $("#ranknum").text(d.properties.rank+"/22");
        })
    });
    d3.select('button:nth-child(1)').on('click', function () {
        color = d3.scale.linear().domain([50,400]).range(["#FFFFFF","#003377"]);
        $("#countyname")    .text("臺北市");
        $("#population")    .text("人口數量 : 2695704人");
        $("#doctor")    .text("病床數量 : 19951床");
        $("#serve")    .text("一張病床提供幾人使用");
        $("#servenum")    .text("135.11人");
        $("#ranknum").text("4/22");
        d3.selectAll('.county')
        .data(features)
        .attr('fill', function (d) {
                return color(d.properties.average);
            })
        .on("click", function (d) {
            d3.select(this).style('stroke-width', '2');
            d3.select(this).style('stroke', '#FB7F7F');
            $("#countyname").text(d.properties.COUNTYNAME);
            $("#population").text("人口數量 : "+d.properties.population+"人");
            $("#doctor")    .text("病床數量 : "+d.properties.bed+"床");
            $("#servenum")     .text(d.properties.average+"人");
            $("#ranknum").text(d.properties.rank2+"/22");
        })
    });
});