function draw (data) {
    // remove existing svg
    // removing this will append a new graph
    d3.select("body").select("svg").remove();

    var symbol = d3.scale.ordinal().range(d3.svg.symbolTypes),
        color = d3.scale.category10();

    var margin = {top: 0, right: 0, bottom: 12, left: 100},
        width = 1060 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain(d3.extent(data, function(d) { return d.time }))
        .range([0, width]);

    /*
    var yrange = d3.extent(data, function(d) { return d.code });
    var ymin = yrange[0],
        ymax = yrange[1];
    yrange = ymax - ymin;
    var y = d3.scale.linear()
        //.domain(d3.extent(data, function(d) { return d.code }))
        .domain([ymin - yrange * .05, ymax + yrange * .05])
        .range([height, 0]);
    */
    
    var names = $.unique($.map(data, function (d) { return d.name } ));
    var y = d3.scale.ordinal()
        .domain(names)
        .rangePoints([height,0], 1.0);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(-height);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5)
        .tickSize(-width);

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        //.call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 8]).on("zoom", zoom));
        .call(d3.behavior.zoom().x(x).scaleExtent([1, 100]).on("zoom", zoom));

    svg.append("rect")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    
    svg.selectAll("circle.dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("stroke", function(d, i) { return color(y(d.name)); })
        .attr("cx", function(d) { return x(d.time); })
        .attr("cy", function(d) { return y(d.name); })
        .attr("visibility", function(d) { return x(d.time) < 0 ? 'hidden' : 'visible'; })
        .attr("r", 4)
        .on("mouseover", popup())
        .on("mouseout", destroy_popup());
    /*
    svg.selectAll("path.dot")
        .data(data)
      .enter().append("path")
        .attr("class", "dot")
        .attr("stroke", function(d, i) { return color(y(d.name)); })
        .attr("transform", function(d) { return "translate(" + x(d.time) + "," + y(d.name) + ")"; })
        .attr("d", d3.svg.symbol()
        .type(function(d, i) { return symbol('circle'); }));
*/
    function popup() {
        return function(d) {
            svg.selectAll(".popup")
                .data([d])
              .enter().append("text")
                .attr("class", "popup")
                .attr("x", function(d) { return x(d.time); })
                .attr("y", function(d) { return y(d.name); })
                .attr("dx", "2em")
                .attr("dy", "-2em")
                .text(function(d) { return d.name + ", Time: " + d.time + ", Value: " + d.value });
        };
    }

    function destroy_popup() {
        return function() {
            svg.selectAll(".popup")
                .remove();
        };
    }

    function zoom() {
      svg.select(".x.axis").call(xAxis);
      svg.selectAll("circle.dot")
          .attr("cx", function (d) { return x(d.time); })
          .attr("visibility", function (d) { return x(d.time) < 0 ? 'hidden' : 'visible'; });
      //svg.select(".y.axis").call(yAxis);
      //svg.selectAll("path.dot")
      //  .attr("transform", function(d) { return "translate(" + x(d.time) + "," + y(d.name) + ")"; });
    }
}
