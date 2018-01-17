// method to get page height
function pageHeight() {
    var lReturn = window.innerHeight;
    if (typeof lReturn == "undefined") {
        if (typeof document.documentElement != "undefined" && typeof document.documentElement.clientHeight != "undefined") {
            lReturn = document.documentElement.clientHeight;
        } else if (typeof document.body != "undefined") {
            lReturn = document.body.clientHeight;
        }
    }
    return lReturn;
}

// method to get page width
function pageWidth() {
    var lReturn = window.innerWidth;
    if (typeof lReturn == "undefined") {
        if (typeof document.documentElement != "undefined" && typeof document.documentElement.clientWidth != "undefined") {
            lReturn = document.documentElement.clientWidth;
        } else if (typeof document.body != "undefined") {
            lReturn = document.body.clientWidth;
        }
    }
    return lReturn;
}

// Create Graph using d3.js force-directed layout
function initialise (graph) {
    // http://blog.thomsonreuters.com/index.php/mobile-patent-suits-graphic-of-the-day/
    // var links = [
    //     {source: "Microsoft", target: "Amazon", type: "licensing"},
    //     {source: "Microsoft", target: "HTC", type: "licensing"},
    //     {source: "Samsung", target: "Apple", type: "suit"},
    //     {source: "Motorola", target: "Apple", type: "suit"},
    //     {source: "Nokia", target: "Apple", type: "resolved"},
    //     {source: "HTC", target: "Apple", type: "suit"},
    //     {source: "Kodak", target: "Apple", type: "suit"},
    //     {source: "Microsoft", target: "Barnes & Noble", type: "suit"},
    //     {source: "Microsoft", target: "Foxconn", type: "suit"},
    //     {source: "Oracle", target: "Google", type: "suit"},
    //     {source: "Apple", target: "HTC", type: "suit"},
    //     {source: "Microsoft", target: "Inventec", type: "suit"},
    //     {source: "Samsung", target: "Kodak", type: "resolved"},
    //     {source: "LG", target: "Kodak", type: "resolved"},
    //     {source: "RIM", target: "Kodak", type: "suit"},
    //     {source: "Sony", target: "LG", type: "suit"},
    //     {source: "Kodak", target: "LG", type: "resolved"},
    //     {source: "Apple", target: "Nokia", type: "resolved"},
    //     {source: "Qualcomm", target: "Nokia", type: "resolved"},
    //     {source: "Apple", target: "Motorola", type: "suit"},
    //     {source: "Microsoft", target: "Motorola", type: "suit"},
    //     {source: "Motorola", target: "Microsoft", type: "suit"},
    //     {source: "Huawei", target: "ZTE", type: "suit"},
    //     {source: "Ericsson", target: "ZTE", type: "suit"},
    //     {source: "Kodak", target: "Samsung", type: "resolved"},
    //     {source: "Apple", target: "Samsung", type: "suit"},
    //     {source: "Kodak", target: "RIM", type: "suit"},
    //     {source: "Nokia", target: "Qualcomm", type: "suit"}
    // ];
    //
    // var nodes = {};
    //
    // // Compute the distinct nodes from the links.
    // links.forEach(function (link) {
    //     link.source = nodes[link.source] || (nodes[link.source] = {
    //         name: link.source
    //     });
    //     link.target = nodes[link.target] || (nodes[link.target] = {
    //         name: link.target
    //     });
    // });

		nodes = graph.nodes;
		links = graph.links;

    var w = pageWidth() - 10,
        h = pageHeight() - 10;

    force = d3.layout.force()
                  .nodes(d3.values(nodes))
                  .links(links)
                  .size([w, h])
                  .linkDistance(60)
                  .charge(-300)
                  .on("tick", tick)
                  .start();

    var svg = d3.select(".graphContainer").append("svg:svg")
                .attr("width", w)
                .attr("height", h);

	 svg.on("mousedown", function () {force.stop();})

	 topG = svg.append("svg:g");

    var path = topG.append("svg:g")
                  .selectAll("path")
                  .data(force.links())
                  .enter().append("svg:path")
                  .attr("class", function (d) {
                      return "link " + d.type;
                  });
		var drag = d3.behavior.drag()
					.on("drag", function(d,i) {
						d.x += d3.event.dx
						d.y += d3.event.dy
						tick();
				});


			var g = topG.append("svg:g")
								.selectAll("g")
								.data(force.nodes())
								.enter().append("svg:g")
								.call(drag);

			var innerG = g.append("svg:g");

		var circle = innerG.append("svg:circle")
      .attr("r", 6);

    var text = innerG.append("svg:g")
                  .attr("class", "nodeText");

    // A copy of the text with a thick white stroke for legibility.
    text.append("svg:text")
        .attr("x", 8)
        .attr("y", ".31em")
        .attr("class", "shadow")
        .text(function (d) {
            return d.id;
        });

    text.append("svg:text")
        .attr("x", 8)
        .attr("y", ".31em")
        .text(function (d) {
            return d.id;
        });


    // Use elliptical arc path segments to doubly-encode directionality.
    function tick() {
        path.attr("d", function (d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0 1," + d.target.x + "," + d.target.y;
        });

				// circle.attr("transform", function (d) {
	      //     return "translate(" + d.x + "," + d.y + ")";
	      // });
        //
	      // text.attr("transform", function (d) {
	      //     return "translate(" + d.x + "," + d.y + ")";
	      // });

				g.attr("transform", function (d) {
				    return "translate(" + d.x + "," + d.y + ")";
				});
    }

    // Method to create the filter
    createFilter();

    // Method to create the filter, generate checkbox options on fly
    function createFilter() {
        d3.select(".filterContainer").selectAll("div")
          .data(["HI", "HP", "SL"])
          .enter()
          .append("div")
          .attr("class", "checkbox-container")
          .append("label")
          .each(function (d) {
                // create checkbox for each data
                d3.select(this).append("input")
                  .attr("type", "checkbox")
                  .attr("id", function (d) {
                      return "chk_" + d;
                   })
                  .attr("checked", true)
                  .on("click", function (d, i) {
                      // register on click event
                      var lVisibility = this.checked ? "visible" : "hidden";
                      filterGraph(d, lVisibility);
                   })
                d3.select(this).append("span")
                    .text(function (d) {
                        return d;
                    });
        });
        $("#sidebar").show();
    }

    // Method to filter graph
    function filterGraph(aType, aVisibility) {
        // change the visibility of the connection path
        path.style("visibility", function (o) {
            var lOriginalVisibility = $(this).css("visibility");
            return o.type === aType ? aVisibility : lOriginalVisibility;
        });

        // change the visibility of the node
        // if all the links with that node are invisibile, the node should also be invisible
        // otherwise if any link related to that node is visibile, the node should be visible
        circle.style("visibility", function (o, i) {
            var lHideNode = true;
            path.each(function (d, i) {
                if (d.source === o || d.target === o) {
                    if ($(this).css("visibility") === "visible") {
                        lHideNode = false;
                        // we need show the text for this circle
                        d3.select(d3.selectAll(".nodeText")[0][i]).style("visibility", "visible");
                        return "visible";
                    }
                }
            });
            if (lHideNode) {
                // we need hide the text for this circle
                d3.select(d3.selectAll(".nodeText")[0][i]).style("visibility", "hidden");
                return "hidden";
            }
        });
    }

	var min_zoom = 0.1;
	var max_zoom = 7;
	var zoom = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom])
	zoom.on("zoom", function() {
		topG.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		innerG.attr("transform", "translate(0 0)scale(" + (1/d3.event.scale) + ")");
		path.attr("stroke-width", (1.5/d3.event.scale) + "px");
	});

	svg.call(zoom);
};
