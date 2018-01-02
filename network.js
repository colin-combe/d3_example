<!DOCTYPE html>
<html>
<head>
<meta name="generator" content=
"HTML Tidy for HTML5 for Linux version 5.2.0">
<meta charset="utf-8">
<style>

.link {
    stroke: #999;
    stroke-opacity: .6;
}

.node {
  stroke: black;
  fill: white;
}

.node text {
  font-family: Arial, sans-serif;
<!--
  font-size: 10px;
-->
<!--
  font-weight: 100;
-->
}

#thresholdSlider{
	width:600px;
}

</style>
<title>your network</title>
</head>
<body>
	
<h3>Link threshold 0 <input type="range" id="thresholdSlider" 
name="points" value="0" min="0" max="100" oninput="threshold(this.value)"> 1</h3>

<script src="//d3js.org/d3.v3.min.js"/></script> 
<script>

	var width = 960, height = 500;

	//Set up the force layout
	var force = d3.layout.force()
		.charge(-150)
		.linkDistance(40)
		.size([width, height]);

	//Append a SVG to the body of the html page. Assign this SVG as an object to svg
	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height);

	var unfilteredLinks, links, nodes, linkSel, nodeSel;

	//for reading csv
	d3.csv("exampleCut.csv", function(error, csv) {
		links = csv;
	
	//for reading json
	//~ d3.json("test.json", function(error, json) {//to read json uncomment this and next line
		//~ links = json.links;
		
		if (error) throw error;
		
		//store a copy of the unfiltered links
		unfilteredLinks = links.slice();
				
		//https://stackoverflow.com/questions/11088303/how-to-convert-to-d3s-json-format/11089330#11089330/
		var nodesByName = {};
		// Create nodes for each unique source and target.
		links.forEach(function(link) {
			link.source = nodeByName(link.source);
			link.target = nodeByName(link.target);
		});
		// Extract the array of nodes from the map by name.
		nodes = d3.values(nodesByName);
		function nodeByName(name) {
			return nodesByName[name] || (nodesByName[name] = {name: name});
		}
		
		//Create all the line svgs but without locations yet
		linkSel = svg.selectAll(".link")
			.data(links)
			.enter().append("line")
			.attr("class", "link")
			.style("stroke-width", function (d) {
				//console.log(">>>>"+d.value);
				return (d.value * 4);
		});		
				
		// Create the node circles.
		nodeSel = svg.selectAll(".node")
				.data(nodes)
				.enter().append("g").attr("class", "node")
				.call(force.drag);

		nodeSel.append("circle")
				.attr("r", 4.5)
				.append("title").text(function(d) { return d.name; });

		//uncomment to add labels
		/*var labelMaxLength = 10;
		nodeSel.append("text")
			.text(function(d) { 
				var name = d.name;
				if (name.length > labelMaxLength) {
					name = name.substring(0, labelMaxLength) + "..."
				}
				return name; 
		});*/

		// Start the force layout.
		force
			.nodes(nodes)
			.links(links)
			.on("tick", tick)
			.start();

		function tick() {
			linkSel.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });

			d3.selectAll("circle").attr("cx", function (d) {
				return d.x;
				})
				.attr("cy", function (d) {
					return d.y;
				})
				.attr("display", function (d) {
					return (d.weight == 0) ? "none" : "block";
				})
				;

				d3.selectAll("text").attr("x", function (d) {
						return d.x + 5;
				})
				.attr("y", function (d) {
						return d.y + 5;
				})
				.attr("display", function (d) {
					return (d.weight == 0) ? "none" : "block";
				})
				;;
		}

	});


	//http://www.coppelia.io/2014/07/an-a-to-z-of-extra-features-for-the-d3-force-layout/
	//adjust threshold
	function threshold(thresh) {
		links.splice(0, links.length);
		for (var i = 0; i < unfilteredLinks.length; i++) {
				if (unfilteredLinks[i].value > (thresh / 100)) {links.push(unfilteredLinks[i]);}
		}
		restart();
	}
	//Restart the visualisation after any node and link changes
	function restart() {
		linkSel = linkSel.data(links);
		linkSel.exit().remove();
		linkSel.enter().insert("line", ".node")
			.attr("class", "link")
			.style("stroke-width", function (d) {
				//console.log(">>>>"+d.value);
				return (d.value * 4);
		});

		
		force.start();
		
		//can't get following approach to removing unlinked nodes to work,
		//breaks the data binding, using styling change in tick function, which isn't optimal performance
		
		//~ nodeSel = nodeSel.data(nodes.filter(function(d){
			//~ var result = true;
			//~ if (d.weight == 0) {
				//~ result = false;
			//~ }
			//~ console.log(">>" + d.weight + result);
			//~ return result;
		//~ }));
		//~ nodeSel.enter().insert("circle", ".cursor").attr("class", "node").attr("r", 5).call(force.drag);
		//~ nodeSel.exit().remove();

	}
</script>
</body>
</html>
