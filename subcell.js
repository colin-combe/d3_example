d3.text("subcell.txt", function(error, text) {
    if (error) throw error;

    var lines = text.split('\n');
    var currentLine = 0;
    while (lines[currentLine][0] !== '_'){
      // console.log(lines[currentLine]);
      currentLine++;
    }

    var nodeMap = new Map();
    var node;

    for(currentLine; currentLine < lines.length; currentLine++){
        var line = lines[currentLine];
        var lId = line.substring(0, 2);
        var val = line.substring(5);
        // console.log(lId);
        switch (lId) {
          case "ID":
            console.log(val);
            node = {"id":val};
            break;
          case "//":
            nodeMap.set(node.id, node);
            break;
          default:

        }
    }

    var graph = {"links":[]};

    graph.nodes = Array.from(nodeMap.values());
    initialise(graph);

    // var mis = document.getElementById('mis').innerHTML;
    // initialise(JSON.parse(mis));
  }
);
