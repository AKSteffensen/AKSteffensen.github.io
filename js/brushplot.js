var margin_chart = {top: 10, right: 30, bottom: 60, left: 80},
    width_chart = 800 - margin_chart.left - margin_chart.right,
    width_brush = width_chart ;
    height_chart = 200 - margin_chart.top - margin_chart.bottom,
    height_brush = height_chart ;


var margin_map = {top: 0, right: 0, bottom: 0, left: 0},
    width_map = 600 - margin_map.left - margin_map.right,
    height_map = 500 - margin_map.top - margin_map.bottom;

var margin_newbar = {top: 0, right: 0, bottom: 0, left: 0},
    width_newbar = 600 - margin_newbar.left - margin_newbar.right,
    height_newbar = 500 - margin_newbar.top - margin_newbar.bottom;

var svgchart = d3.select("#brushplot")
                .append("svg")
                .attr("width", width_chart + margin_chart.left + margin_chart.right)
                .attr("height", height_chart + margin_chart.top + margin_chart.bottom)
                .append("g")
                .attr("transform",
                        "translate(" + margin_chart.left + "," + margin_chart.top + ")");

var svgmap = d3.select("#brushplot").append("svg")
              .attr("width", width_map)
              .attr("height", height_map);

var svgbar = d3.select("#brushplot")
                .append("svg")
                .attr("width", width_newbar + margin_newbar.left + margin_newbar.right)
                .attr("height", height_newbar + margin_newbar.top + margin_newbar.bottom)
                //.append("g")
                .attr("transform", "translate(" + margin_newbar.left + "," + margin_newbar.top + ")");

var projection = d3.geoMercator().scale(45000).translate([width_map /2, height_map/2]).center([-74.0, 40.7]);
var path = d3.geoPath().projection(projection);

var color = d3.scaleThreshold().range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)"]);


             // Load in my states data!
                d3.csv("data/complaint_sample2.csv", function(data) {
                   //----------draw histogram------------
                   d3.json("data/boroughs.geojson", function(json) {

                    //map
                    // Bind the data to the SVG and create one path per GeoJSON feature
                        svgmap.selectAll("path")
                          .data(json.features)
                          .enter()
                          .append("path")
                          .attr("d", path)
                          .style("stroke", "#fff")
                          .style("stroke-width", "1")
                          .style("fill", function(d) {
                              // Get data value
                              var value = d.properties.BoroName;

                              if (value == "Staten Island") {
                                return "rgb(172, 146, 235)";
                              } else if (value == "Bronx") {
                                return "rgb(79, 193, 232)";
                              } else if (value == "Manhattan"){
                                return "rgb(160, 213, 104)";
                              }else if (value == "Brooklyn"){
                                return "rgb(255, 206, 84)";
                              }else if (value == "Queens"){
                                return "rgb(237, 85, 100)";
                              }
                            });

                    var parseDate = d3.timeParse("%Y-%m-%d");



                    var nest = d3.nest()
                                  .key(function(d) {return d.CreatedDate})
                                  .rollup(function (v) {return v.length})
                                  .entries(data);

                    nest.forEach(function(d){
                      d.key = parseDate(d.key);
                    });

                    //console.log(nest);

                    var brush = d3.brushX()
                                  .extent([[0, 0], [width_brush, height_brush]])
                                  //.transition()           // apply a transition
                                  //.duration(4000)
                                  .on("brush", updateData)
      //                            .on("end", updateData);
                                  ;

                  //parse csv data
                  data.forEach(function(d){
                      d.CreatedDate = parseDate(d.CreatedDate);
                    });

                  //make new array for selected data
                  function updateData(){
                    brushedData = [];
                    range = d3.brushSelection(this)
                            .map(x.invert);

                      for (var i = 0 ; i < data.length; i++){
                        if (data[i].CreatedDate >= range[0] && data[i].CreatedDate <= range[1]){
                            brushedData.push(data[i]);
                        }
                      };
                      //console.log(brushedData);
                      drawCircle();

      //make an array for nest data
                      var nestBar = d3.nest()
                                  .key(function(d) {return d.Time})
                                  .rollup(function (v) {return v.length})
                                  .entries(data);

                      nestBar.forEach(function(d){
                        d.key = parseInt(d.key);
                      });

                      // console.log(nestBar);



                  }

                    var x = d3.scaleTime()
                              .domain([new Date("2015-01-01"), new Date("2015-12-31")])
                              .range([0, width_chart]);

                    var y = d3.scaleLinear()
                              .range([height_chart, 0]);



                    y.domain([0, d3.max(nest, function(d) { return d.value; })]);


                    // append the bar rectangles to the svg element
                    svgchart.selectAll("rect")
                        .data(nest)
                        .enter()
                        .append("rect")
                        .attr("class", "bar")
                        .style("fill", "rgb(47,79,79)" )
                        .attr("x", function (d) {return x(d.key) })
                        .attr("y", function (d){ return y(d.value)})
                        .attr("width", 1)
                        .attr("height", function(d) { return height_chart - y(d.value); });



                     var xAxis = d3.axisBottom(x);
                     var yAxis = d3.axisLeft(y);

                     //add brush area box
                     svgchart.append("g")
                          .attr("class", "brush")
                          .call(brush)
                          .call(brush.move, [new Date("2015-01-01"), new Date("2015-01-31")].map(x));

                    // add the x Axis
                    svgchart.append("g")
                        .attr("class", "xAxis")
                        .attr("transform", "translate(0," + height_chart + ")")
                        .call(xAxis);


                    // add the y Axis
                    svgchart.append("g")
                        .attr("class", "yAxis")
                        .call(yAxis);

                    svgchart.append("text")
                        .attr("transform", "translate(-35," + (height_chart + margin_chart.bottom)/1.7 + ") rotate(-90)")
                        .text("# of incidents");

                    svgchart.append("text")
                        .attr("transform", "translate(" + (width_chart / 2) + "," + (height_chart + margin_chart.bottom) + ")")
                        .text("Year");


                  //map
                  // Bind the data to the SVG and create one path per GeoJSON feature
                        // svgmap.selectAll("path")
                        //   .data(json.features)
                        //   .enter()
                        //   .append("path")
                        //   .attr("d", path)
                        //   .style("stroke", "#fff")
                        //   .style("stroke-width", "1")
                        //   .style("fill", function(d) {
                        //       // Get data value
                        //       var value = d.properties.BoroName;

                        //       if (value == "Staten Island") {
                        //         return "rgb(107,174,214)";
                        //       } else if (value == "Bronx") {
                        //         return "rgb(213,222,217)";
                        //       } else if (value == "Manhattan"){
                        //         return "rgb(222,235,247)";
                        //       }else if (value == "Brooklyn"){
                        //         return "rgb(198,219,239)";
                        //       }else if (value == "Queens"){
                        //         return "rgb(158,202,225)";
                        //       }
                        //     });


                    function drawCircle(){
                      //remove all circle first
                      svgmap.selectAll("circle").remove();

                      //draw circle
                      var circles = svgmap.selectAll("circle")
                                    .data(brushedData) //change to range of new data
                                    .enter()
                                    .append("circle")
                                    .attr("cx", function(d) {
                                      return projection([d.Longitude, d.Latitude])[0];
                                    })
                                    .attr("cy", function(d) {
                                      return projection([d.Longitude, d.Latitude])[1];
                                    })
                                    //.attr("class", "non_brushed")
                                    .attr("r", 3)
                                      .style("fill", "rgb(47,79,79)")
                                      .style("opacity", 0.7) ;
                    }
      //-----------------------------add name of boroughs------------------------------
      d3.csv("Data/cities.csv", function(error, data) {
         svgmap.selectAll("text")
               .append("g")
               .data(data)
               .enter()
               .append("text")
               .attr("x", function(d){
                 return projection([d.lon, d.lat])[0];
               })
               .attr("y", function(d){
                 return projection([d.lon, d.lat])[1];
               })
               .attr("dy", -7)
               .style("fill", "black")
               .style("opacity", 1)
               .style("stroke","black")
               .style("stroke-opacity", .4)
               .attr("text-anchor", "middle")
               .style("font-size", "16px")
               .text(function(d) {return d.city;});


             });

            svgmap.append("text")
		    .attr("transform", "translate(" + (width_map / 5) + "," + (height_map + margin_map.bottom-5) + ")")
		    .text("Figure 1: Illustration of incidents in each borough in New York in 2015.");

      //-----------------------------end add name of boroughs------------------------------
      //-------------------------animation---------------------------------------------------------

                    d3.select("input")
                      .on("click",function(){
                      //do something on click

                        //Update all rects
      //                   svgchart.select("g").remove();
      //                   svgchart.append("g")
                         svgchart.select("g")
                         .transition()
                         .duration(500)
                         .call(brush.move, [new Date("2015-01-01"), new Date("2015-02-01")].map(x))
                         .on("end",updateData)

                                 .transition()
                                 .duration(500)
                                  .ease(d3.easeLinear)
                                 .call(brush.move, [new Date("2015-02-01"), new Date("2015-03-01")].map(x))
                                 .on("end",updateData)


                                 .transition()
                                 .duration(500)
                                  .ease(d3.easeLinear)
                                 .call(brush.move, [new Date("2015-03-01"), new Date("2015-04-01")].map(x))
                                 .on("end",updateData)

                                 .transition()
                                 .duration(500)
                                  .ease(d3.easeLinear)
                                 .call(brush.move, [new Date("2015-04-01"), new Date("2015-05-01")].map(x))
                                 .on("end",updateData)

                                 .transition()
                                 .duration(500)
                                  .ease(d3.easeLinear)
                                 .call(brush.move, [new Date("2015-05-01"), new Date("2015-06-01")].map(x))
                                 .on("end",updateData)

                                 .transition()
                                 .duration(500)
                                  .ease(d3.easeLinear)
                                 .call(brush.move, [new Date("2015-06-01"), new Date("2015-07-01")].map(x))
                                 .on("end",updateData)

                                 .transition()
                                 .duration(500)
                                  .ease(d3.easeLinear)
                                 .call(brush.move, [new Date("2015-07-01"), new Date("2015-08-01")].map(x))
                                 .on("end",updateData)

                                 
                                 .transition()
                                 .duration(500)
                                  .ease(d3.easeLinear)
                                 .call(brush.move, [new Date("2015-08-01"), new Date("2015-09-01")].map(x))
                                 .on("end",updateData)

                                 
                                 .transition()
                                 .duration(500)
                                  .ease(d3.easeLinear)
                                 .call(brush.move, [new Date("2015-09-01"), new Date("2015-10-01")].map(x))
                                 .on("end",updateData)

                                 .transition()
                                 .duration(500)
                                  .ease(d3.easeLinear)
                                 .call(brush.move, [new Date("2015-10-01"), new Date("2015-11-01")].map(x))
                                 .on("end",updateData)

                                 .transition()
                                 .duration(500)
                                  .ease(d3.easeLinear)
                                 .call(brush.move, [new Date("2015-11-01"), new Date("2015-12-01")].map(x))
                                 .on("end",updateData)
                                 
                                 .transition()
                                 .duration(500)
                                  .ease(d3.easeLinear)
                                 .call(brush.move, [new Date("2015-12-01"), new Date("2015-12-31")].map(x))
                                 .on("end",updateData)  


                                 ;
      //-------------------------end animation---------------------------------------------------------

                          // .ease(d3.easeLinear);



                         });

                    });
              });