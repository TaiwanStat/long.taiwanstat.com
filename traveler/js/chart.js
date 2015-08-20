/** @jsx React.DOM */
var colorScale = d3.scale.category10();
var width = 800;
var height = width*0.6;
var margin = {top:20,left:100,bottom:70,right:20}
var xScale = d3.scale.linear().domain([1999,2014]).range([0,width-margin.left-margin.right]);
var yScale = d3.scale.linear().domain([0,10000000]).range([height-margin.bottom-margin.top,0]);
var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(function(d){return d;});
var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10);
var tip = d3.tip().attr('class', 'd3-tip')
    .html(function(d) {
        var x = d3.mouse(this)[0];
        var y = d3.mouse(this)[1];
        var year = Math.round(xScale.invert(x));
        var index = d.length-1-(d[d.length-1].year-year);
        var str = "";
        var j = 0;
        d3.select(".pointer").attr({
            x1:x,
            x2:x,
        })
        for(var i in d[index]){
            if(i === 'year')
                str += ("<span style='color:"+colorScale(j-1)+"'>年 : "+d[index][i]+"</span>"+"<br>");
            else
                str += ("<span style='color:"+colorScale(j-1)+"'>"+i+" : "+d[index][i]+"</span>"+"<br>");
            j++;
        }
        return str

    })
    .offset(function(){
        return [this.getBBox().height/2-30,-this.getBBox().width/2+100]
    });
var Chart = React.createClass({displayName: "Chart",
    componentDidMount:function(){
        var data = this.props.data;
        d3.select("#svg").call(tip);
        d3.select("#svg").append("g")
            .attr("transform","translate("+margin.left+","+(height-margin.bottom)+")")
            .attr("class","xAxis").call(xAxis);
        d3.select("#svg").append("g")
            .attr("transform","translate("+margin.left+","+margin.top+")")
            .attr("class","yAxis").call(yAxis);
        d3.select(".lineChart").append("line").attr({
            class:"pointer",
            x1:0,
            x2:0,
            y1:0,
            y2:height-margin.bottom-margin.top,
            stroke:"grey"
        })
        d3.select(".lineChart").append("rect").datum(data).attr({
            width:width-margin.left-margin.right,
            height:height-margin.top-margin.bottom,
            opacity:0,
        }).on("mousemove",tip.show);

    },
    createPath:function(){
        var target;
        var line = d3.svg.line().interpolate("basis")
            .x(function(d){return xScale(d.year);})
            .y(function(d){return d[target]=="-"?yScale(0):yScale(d[target]);});
        var targets = [];
        for(var i in this.props.data[0]){
            if (i!="year"){
                targets.push(i);
            }
        }
        return targets.map(function(i,index){
                target = i;
                var d=line(this.props.data);
                return(
                    React.createElement("path", {d: d, stroke: colorScale(index)})
                )
            }.bind(this)
        )
    },
    render:function(){
        var data = this.props.data;
        var yearMin = parseInt(this.props.data[0].year);
        var yearMax = parseInt(this.props.data[this.props.data.length-1].year);
        var personMax = this.props.data[this.props.data.length-1].合計;
        xScale.domain([yearMin,yearMax]);
        yScale.domain([0,personMax]);
        d3.select(".xAxis").transition().duration(500).call(xAxis);
        d3.select(".yAxis").transition().duration(500).call(yAxis);
        d3.select(".lineChart rect").datum(data)
        return(
            React.createElement("svg", {id: "svg", width: width, height: height},
                React.createElement("g", {className: "lineChart", transform: "translate("+margin.left+","+margin.top+")"},
                    this.createPath()
                )
            )
        )
    }
})
var Button = React.createClass({displayName: "Button",
    render:function(){
        return(
            React.createElement("button", {className: "ui button", value: this.props.value, onClick: this.props.onClick},
                this.props.value
            )
        )
    }
})
var Content = React.createClass({displayName: "Content",
    getInitialState:function(){
        return{
            buttonValue:["來台旅客人數(依目的)","來台旅客人數(依地區)","出國旅客人數(依地區)"],
            data:this.props.data
        }
    },
    getDefaultProps:function(){

    },
    clickHandler:function(event,id){
        var dom = $("button[data-reactid='"+id+"']")[0];
        var index = this.state.buttonValue.indexOf(dom.value);
        var filename;
        if(index == 0){
            filename = "inByWhy.csv";
        }
        else if(index == 1){
            filename = "inByPlace.csv";
        }
        else{
            filename = "out.csv";
        }
        d3.csv(filename,function(data){
            this.setState({
                data:data,
            })
        }.bind(this))
    },

    createButton:function(){
        return this.state.buttonValue.map(function(i){
                return (React.createElement(Button, {value: i, onClick: this.clickHandler}))
            }.bind(this)
        )
    },
    render:function(){
        return(
            React.createElement("div", null,
                React.createElement("div", {className: "ui vertical segment"},
                    this.createButton()
                ),
                React.createElement("div", {id: "chart", className: "ui vertical segment"},
                    React.createElement(Chart, {data: this.state.data})
                )
            )
        )
    }
})
d3.csv("inByWhy.csv",function(data){
    React.render(React.createElement(Content, {data: data}),document.getElementById("content"));
})
