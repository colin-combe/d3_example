function initialise(json) {

		var width = window.innerWidth, height = window.innerHeight;

	var svg = d3.select("#networkDiv").append("svg")
		.attr("width", width)
		.attr("height", height)
		.on("click", function () {force.stop()});

	var width = window.innerWidth, height = window.innerHeight;


	//Set up the force layout
	force = d3.layout.force()
		.charge(-150)
		.linkDistance(40)
		.size([width, height]);

	//Append a SVG to the body of the html page. Assign this SVG as an object to svg

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

			var nodes, nodeSel;
			links = json.links;
	    nodes = json.nodes;
			//store a copy of the unfiltered links
			unfilteredLinks = links.slice();



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


		//uncomment to add labels
		var labelMaxLength = 10;
		var textBBox = nodeSel.append("text")
			.text(function(d) {
				return d.id;
			})
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "central")
			.node().getBBox();

		nodeSel.append("rect")
		.attr("x", function (d) {return - (d.id.length * 10 / 2);})
		.attr("y", function (d) {return - (textBBox.height / 2);})
		.attr("width", function(d) {
			return d.id.length * 10;
		})
		.attr("height", textBBox.height)
		.classed("box", true);
				// .append("title").text(function(d) { return d.id; });


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

			d3.selectAll("g").attr("transform", function (d) {
				return "translate(" + d.x + " " + d.y + ")";
				})
				// .attr("display", function (d) {
				// 	return (d.weight == 0) ? "none" : "block";
				// })
				;

			// d3.selectAll("text").attr("x", function (d) {
			// 			return d.x;
			// 	})
			// 	.attr("y", function (d) {
			// 			return d.y;
			// 	})
				// .attr("display", function (d) {
				// 	return (d.weight == 0) ? "none" : "block";
				// })
				;;
		}
};

function filter() {
	links.splice(0, links.length);
	var isA = document.getElementById("isA_cb").checked;
	var partOf = document.getElementById("partOf_cb").checked;
	var location = document.getElementById("location_cb").checked;
	console.log(isA);
	for (var i = 0; i < unfilteredLinks.length; i++) {
			var l = unfilteredLinks[i];
			if ((l.type == "HI" && isA)
					|| (l.type == "HP" && partOf)
					|| (l.type == "SL" && location)) {links.push(l);}
	}
	restart();
};

//Restart the visualisation after any node and link changes
function restart() {
	linkSel = linkSel.data(links);
	linkSel.exit().remove();
	linkSel.enter().insert("line")
		.attr("class", function(d){return d.type})
	 .style("marker-end",  "url(#suit)") ;
		// .style("stroke-width", function (d) {
		// 	//console.log(">>>>"+d.value);
		// 	return (d.value * 4);
	// });

	// force.start();

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
};
