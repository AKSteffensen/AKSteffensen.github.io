(function() {
	"use strict";
}());

// BARPLOT VARIABLES ETC ------------------------------------------------------------
//Defining SVG size
var margin = {top: 0, right: 20, bottom: 20, left: 50},
    margin2 = {top: 0, right: 20, bottom: 20, left: 50},
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// GEO VARIABLES ------------------------------------------------------------
var geoWidth = 450;
var geoHeight = 750;
var scale = 9000;

//Create geoplotSvg element
var geoplotSvg = d3.select("#geoviz")
	.append("svg")
	.attr("width", geoWidth)
	.attr("height", geoHeight);
// END --------------------------------------------------------------------------

// Load in GeoJSON data
function load_geo_data() {
	// colors used for the map
	var colors = {
		'stroke': '#59495e',
		'base': '#cccccc',
		'hover': '#f4511e',
	};

	d3.json("data/geodata.geojson", function(json) {
		var center = d3.geoCentroid(json);

		// initial projection object
		var projection = d3.geoMercator()
			.scale(1)
			.translate([0,0]);

		// path, draws the map
		var path = d3.geoPath()
			.projection(projection);

		// compute a new bounding-box for the NYC area
		var b = path.bounds(json);
		var scale = 0.95 / Math.max((b[1][0] - b[0][0]) / geoWidth,
								(b[1][1] - b[0][1]) / geoHeight);
	    var translation = [(geoWidth - scale * (b[1][0] + b[0][0])) / 2,
						   (geoHeight - scale * (b[1][1] + b[0][1])) / 2];
		var tooltip = d3.select("#geoviz").append('div').attr("class", "toolTip");

		// project the new bb
		projection.scale(scale).translate(translation);
		
		// initTinyBars();


		geoplotSvg.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("stroke", colors.stroke)
			.style("stroke-width", "1")
			.style("fill", colors.base)
			.on('mouseover', function(d) {
				d3.select(this).style('fill', colors.hover);
				// load new dataset for tiny bars
			// var ds = d.properties.BoroName.toLowerCase().replace(/ /g, '_');
			// ds = ds + '.csv';
				tooltip
					// .style('position', 'relative')
                  .style("left", d3.event.pageX)
                  .style("top", d3.event.pageY )
                  .style("display", "inline-block")
                  .html("Borough: " + (d.properties.BoroName) + "<br>" +
                        "Felony: " + (d.properties.Felony) + "<br>" +
                        "Misdemeanor: " + (d.properties.Mis) + "<br>" +
                        "Violation: " + (d.properties.Vio) + "<br>" + 
                  		"Total: " + (d.properties.Felony + d.properties.Mis + d.properties.Vio));
				// updateTiny(ds);
			})
			.on('mouseout', function() {
				d3.select(this).style('fill', colors.base);
				tooltip.style("display", "none");
				// updateTiny('none.csv');
			});

		geoplotSvg.selectAll("text")
			.data(json.features)
			.enter()
			.append("svg:text")
			.text(function(d) {
				return d.properties.BoroName;
			})
		.attr("x", function(d){
			return path.centroid(d)[0];
		})
		.attr("y", function(d){
			return  path.centroid(d)[1];
		})
		.attr("text-anchor","middle")
		.attr('font-size','14pt')
		.attr('font-weight', 'bold');
	
	});
}

load_geo_data();
