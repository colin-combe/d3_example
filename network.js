function initialise(json) {

	 var width = window.innerWidth, height = window.innerHeight;


	//Set up the force layout
	var force = d3.layout.force()
		.charge(-150)
		.linkDistance(40)
		.size([width, height]);

	//Append a SVG to the body of the html page. Assign this SVG as an object to svg
	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height);

		svg.append("defs").selectAll("marker")
		    .data(["suit", "licensing", "resolved"])
		  .enter().append("marker")
		    .attr("id", function(d) { return d; })
		    .attr("viewBox", "0 -5 10 10")
		    .attr("refX", 25)
		    .attr("refY", 0)
		    .attr("markerWidth", 6)
		    .attr("markerHeight", 6)
		    .attr("orient", "auto")
		  .append("path")
		    .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
		    .style("stroke", "#4679BD")
		    .style("opacity", "0.6");

	var unfilteredLinks, links, nodes, linkSel, nodeSel;

    links = json.links;
    nodes = json.nodes;

		//Create all the line svgs but without locations yet
		linkSel = svg.selectAll(".link")
			.data(links)
			.enter().append("line")
			.attr("class", function(d){return d.type})
			.style("marker-end",  "url(#suit)") // Modified line
			;
			// .style("stroke-width", function (d) {
			// 	//console.log(">>>>"+d.value);
			// 	return (d.value * 4);
		  //   });

		// Create the node circles.
		nodeSel = svg.selectAll(".node")
				.data(nodes)
				.enter().append("g").attr("class", function(d){return d.type})
				.on("click", function(d){console.log(d);})
				.call(force.drag);

		nodeSel.append("circle")
				.attr("r", 4.5)
				.append("title").text(function(d) { return d.id; });

		//uncomment to add labels
		var labelMaxLength = 10;
		nodeSel.append("text")
			.text(function(d) {
				var name = d.id;
				if (name.length > labelMaxLength) {
					name = name.substring(0, labelMaxLength) + "..."
				}
				return name;
		});

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
				// .attr("display", function (d) {
				// 	return (d.weight == 0) ? "none" : "block";
				// })
				;

			d3.selectAll("text").attr("x", function (d) {
						return d.x + 5;
				})
				.attr("y", function (d) {
						return d.y + 5;
				})
				// .attr("display", function (d) {
				// 	return (d.weight == 0) ? "none" : "block";
				// })
				;;
		}

	};
