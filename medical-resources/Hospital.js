var svg = d3.select('.bar')
.append('svg')
.attr('height', '100%')
.attr('width', '100%')
var rect = svg.append('g')
            .attr('id','rect')
            .attr('height', '100%')
            .attr('width', '90%')
var town = svg.append('g')
            .attr('id','town')
var screenwidth=4*screen.width/10;

datapath="./hospital.csv"

d3.csv(datapath,function(dataset){
    var data=[];
    for(var i=0;i<22;i++){
        data[i]=+dataset[i].center;    
    }
    console.log(data)
    minBar = d3.min(dataset,function(d){ return +d.center});
    maxBar = d3.max(dataset,function(d){ return +d.center})
    scaleBar = d3.scale.linear()
        .range([5,4*screen.width/10])
        .domain([minBar, maxBar]); //x 的最大值與最小值

    rect.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('y',function(d,i){
        return i*25;
    })
    .attr('x',60)
    .attr('width',0)
    .attr('height',20)
    .attr('fill','#F58787')
    .transition()
    .duration(2000)
    .attr('width',function(d){
        console.log(scaleBar(d.center));
        return scaleBar(+d.center);
    })

    town.selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
    .text(function(d){ return d.county})
    .attr('x',0)
    .attr('y',function(d,i){
        return i*25+15;
    })
    .attr('font-size','15px')

    rect.selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
    .text(function(d){ return d.center;})
    .attr('x',70)
    .attr('y',function(d,i){
        return i*25+15;
    })
    .transition()
    .duration(2000)
    .attr('x',function(d){
        return scaleBar(d.center)+70;
    })
    .tween("text", function(d,i) {
        var that = d3.select(this),
            k = d3.interpolateRound(0, +d.center);
            data[i]=+d.center;
        return function(t) { that.text(k(t)); };
      })
    
    console.log(data);
    d3.select('.btn-outline-success').on('click',function(){
        minBar = d3.min(dataset,function(d){ return +d.local});
        maxBar = d3.max(dataset,function(d){ return +d.local})
        scaleBar = d3.scale.linear()
        .range([20, 4*screen.width/10])
        .domain([minBar, maxBar]); 

        rect.selectAll('rect')
        .data(dataset)
        .transition()
        .duration(500)
        .attr('x',60)
        .attr('y',function(d,i){
            return i*25;
        })
        .attr('width',0)
        .attr('height',20)
        .transition()
        .duration(1500)
        .attr('width',function(d){
            return scaleBar(+d.local);

        })
        .attr('fill','#81C853')

        rect.selectAll('text')
        .data(dataset)
        .text(function(d){ return d.local})
        .transition()
        .duration(500)
        .attr('x',70)
        .attr('y',function(d,i){
            return i*25+15;
        })
        .text('0')
        .tween("text", function(d,i) {
            var that = d3.select(this),
                k = d3.interpolateRound(data[i], 0);
            return function(t) { that.text(k(t)); };
          })
        .transition()
        .duration(1500)
        .attr('x',function(d){
            return scaleBar(d.local)+70;
        })
        .tween("text", function(d,i) {
            var that = d3.select(this),
                k = d3.interpolateRound(0, +d.local);
                data[i]=+d.local;
            return function(t) { that.text(k(t)); };
          })
    });

    d3.select('.btn-outline-warning').on('click',function(){
        minBar = d3.min(dataset,function(d){ return +d.region});
        maxBar = d3.max(dataset,function(d){ return +d.region})
        scaleBar = d3.scale.linear()
        .range([5,4*screen.width/10])
        .domain([minBar, maxBar]); 

        rect.selectAll('rect')
        .data(dataset)
        .transition()
        .duration(500)
        .attr('x',60)
        .attr('y',function(d,i){
            return i*25;
        })
        .attr('width',0)
        .attr('height',20)
        .transition()
        .duration(1500)
        .attr('width',function(d){
            return scaleBar(+d.region);

        })
        .attr('fill','#EEC328')

        rect.selectAll('text')
        .data(dataset)
        .text(function(d){ return d.region})
        .transition()
        .duration(500)
        .attr('x',70)
        .attr('y',function(d,i){
            return i*25+15;
        })
        .text('0')
        .tween("text", function(d,i) {
            var that = d3.select(this),
                k = d3.interpolateRound(data[i], 0);
            return function(t) { that.text(k(t)); };
          })
        .transition()
        .duration(1500)
        .attr('x',function(d){
            return scaleBar(d.region)+70;
        })
        .tween("text", function(d,i) {
            var that = d3.select(this),
                k = d3.interpolateRound(0, +d.region);
                data[i]=+d.region;
            return function(t) { that.text(k(t)); };
          })
    });

    d3.select('.b3').select('.btn-outline-info').on('click',function(){
        minBar = d3.min(dataset,function(d){ return +d.hos});
        maxBar = d3.max(dataset,function(d){ return +d.hos})
        scaleBar = d3.scale.linear()
        .range([5, 4*screen.width/10])
        .domain([minBar, maxBar]); 
        
        rect.selectAll('rect')
        .data(dataset)
        .transition()
        .duration(500)
        .attr('y',function(d,i){
            return i*25;
        })
        .attr('x',60)
        .attr('width',0)
        .attr('height',20)
        .transition()
        .duration(1500)
        .attr('width',function(d){
            return scaleBar(d.hos);
        })
        .attr('fill','#009D91')

        rect.selectAll('text')
        .data(dataset)
        .text(function(d){ return d.hos})
        .transition()
        .duration(500)
        .attr('x',70)
        .attr('y',function(d,i){
            return i*25+15;
        })
        .text('0')
        .tween("text", function(d,i) {
            var that = d3.select(this),
                k = d3.interpolateRound(data[i], 0);
            return function(t) { that.text(k(t)); };
          })
        .transition()
        .duration(1500)
        .attr('x',function(d){
            return scaleBar(d.hos)+70;
        })
        .tween("text", function(d,i) {
            var that = d3.select(this),
                k = d3.interpolateRound(0, +d.hos);
                data[i]=+d.hos;
            return function(t) { that.text(k(t)); };
          })
    });

    d3.select('.b3').select('.btn-outline-primary').on('click',function(){
        minBar = d3.min(dataset,function(d){ return +d.clinic});
        maxBar = d3.max(dataset,function(d){ return +d.clinic})
        scaleBar = d3.scale.linear()
        .range([20, 4*screen.width/10])
        .domain([minBar, maxBar]); 
        
        rect.selectAll('rect')
        .data(dataset)
        .transition()
        .duration(500)
        .attr('y',function(d,i){
            return i*25;
        })
        .attr('x',60)
        .attr('width',0)
        .attr('height',20)
        .transition()
        .duration(1500)
        .attr('width',function(d){
            return scaleBar(d.clinic);
        })
        .attr('fill','#12BFF4')

        rect.selectAll('text')
        .data(dataset)
        .text(function(d){ return d.clinic})
        .transition()
        .duration(500)
        .attr('x',70)
        .attr('y',function(d,i){
            return i*25+15;
        })
        .text('0')
        .tween("text", function(d,i) {
            var that = d3.select(this),
                k = d3.interpolateRound(data[i], 0);
            return function(t) { that.text(k(t)); };
          })
        .transition()
        .duration(1500)
        .attr('x',function(d){
            return scaleBar(d.clinic)+70;
        })
        .tween("text", function(d,i) {
            var that = d3.select(this),
                k = d3.interpolateRound(0, +d.clinic);
                data[i]=+d.clinic;
            return function(t) { that.text(k(t)); };
          })
    });

    d3.select('.b3').select('.btn-outline-danger').on('click',function(){
        minBar = d3.min(dataset,function(d){ return +d.center});
        maxBar = d3.max(dataset,function(d){ return +d.center})
        scaleBar = d3.scale.linear()
        .range([5, 4*screen.width/10])
        .domain([minBar, maxBar]); 
        
        rect.selectAll('rect')
        .data(dataset)
        .transition()
        .duration(500)
        .attr('y',function(d,i){
            return i*25;
        })
        .attr('x',60)
        .attr('width',0)
        .attr('height',20)
        .transition()
        .duration(1500)
        .attr('width',function(d){
            return scaleBar(d.center);
        })
        .attr('fill','#F58787')

        rect.selectAll('text')
        .data(dataset)
        .text(function(d){ return d.center})
        .transition()
        .duration(500)
        .attr('x',70)
        .attr('y',function(d,i){
            return i*25+15;
        })
        .text('0')
        .tween("text", function(d,i) {
            var that = d3.select(this),
                k = d3.interpolateRound(data[i], 0);
            return function(t) { that.text(k(t)); };
          })
        .transition()
        .duration(1500)
        .attr('x',function(d){
            return scaleBar(d.center)+70;
        })
        .tween("text", function(d,i) {
            var that = d3.select(this),
                k = d3.interpolateRound(0, +d.center);
                data[i]=+d.center;
            return function(t) { that.text(k(t)); };
          })
    });
})

