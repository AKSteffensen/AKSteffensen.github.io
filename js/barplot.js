function addToBar(bar,data,prop,propScale,xScale,w,h,padding,color) {
        		// axis
            	var yAxis = d3.axisLeft().scale(propScale).ticks(5);

            	// add axis to plot
                bar.select(".y.axis").transition().duration(1000).call(yAxis);

        		// add bars to plot
                bar.selectAll("rect").data(data).transition().duration(1000).attr("x",function(d,i) { return xScale(i); }).attr("y",function(d) { return propScale(d[prop]); }).attr("width",xScale.bandwidth()).attr("height",function(d) { return h-propScale(d[prop])-padding; }).attr("fill",function(d) { return color; });
        	}

        	// settings for window
        	var w = 800;
        	var h = 450;
        	var padding = 50;

        	// create window for plot
            var bar = d3.select("#barplot").append("svg").attr("width",w).attr("height",h);

            // load data
            d3.csv("data/incidents.csv",function(error,dataset) {
            	var MaxI = 0;
            	var MaxIN = 0;

            	for (var i = 0; i < dataset.length; i++) {
            		if (+dataset[i].Incidents > MaxI) { MaxI = +dataset[i].Incidents};
            		if (+dataset[i].Incidents_Norm > MaxIN) { MaxIN = +dataset[i].Incidents_Norm};

            	}

            	// scales
            	var xScale = d3.scaleBand().domain(d3.range(dataset.length)).rangeRound([padding,w-padding*3]).paddingInner(0.05);
            	var IScale = d3.scaleLinear().domain([0,MaxI]).range([h-padding,padding]);
            	var INScale = d3.scaleLinear().domain([0,MaxIN]).range([h-padding,padding]);

            	// axis
            	var xAxis = d3.axisBottom().scale(xScale).tickValues(d3.range(dataset.length)).tickFormat(function(d,i) { return dataset[i].Borough;})
            	var yAxis = d3.axisLeft().scale(IScale).ticks(5);

            	// add axis labels and title
				bar.append("text").attr("x",(w/2)-padding).attr("y",0+(padding/2)).attr("text-anchor","middle").style("font-size","16px").style("text-decoration", "underline").text("NYC Complaint Incidents");
				bar.append("text").attr("x",w/2-padding).attr("y",h).style("text-anchor","middle").text("Borough");
				bar.append("text").attr("x",-(h/2)).attr("y",0).attr("transform","rotate(-90)").attr("dy","1em").style("text-anchor","middle").text("Number of Incidents");

            	// add bars to plot
                bar.selectAll("rect").data(dataset).enter().append("rect").attr("x",function(d,i) { return xScale(i); }).attr("y",function(d) { return IScale(d.Incidents); }).attr("width",xScale.bandwidth()).attr("height",function(d) { return h-IScale(d.Incidents)-padding; }).attr("fill",function(d) { return 'red'; });

                // add axis to plot
            	bar.append("g").attr("class","x axis").attr("transform","translate(0,"+(h-padding)+")").call(xAxis);
            	bar.append("g").attr("class","y axis").attr("transform","translate("+padding+",0)").call(yAxis);

                // the following are event listeners to update barplot on click
	        	d3.select("#Incidents").on("click",function() {
	        		d3.select("#button_pl1").selectAll("li").classed("active",false).style("color","black");
	        		d3.select(this.parentNode).classed("active",true).style("color","white");
	        		addToBar(bar,dataset,'Incidents',IScale,xScale,w,h,padding,'red');
	        		return false;
	        	});
	        	d3.select("#Normalized").on("click",function() {
	        		d3.select("#button_pl1").selectAll("li").classed("active",false).style("color","black");
	        		d3.select(this.parentNode).classed("active",true).style("color","white");
	        		addToBar(bar,dataset,'Incidents_Norm',INScale,xScale,w,h,padding,'blue');
	        		return false;
	        	});
	        	
            });
