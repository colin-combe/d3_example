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
          case "IT":
            console.log(val);
            node = {"id":val};
            break;
          case "IO":
            console.log(val);
            node = {"id":val};
            break;
          case "//":
          nodeMap.set(node.id, node);
          break;
          case "  ":
            break;
          case "__":
            break;
          default:
          var currentVal = node[lId];
          if (!currentVal){
            currentVal = [];
            node[lId] = currentVal;
          }
          currentVal.push(val);
        }
    }

    var graph = {};

    var nodesArr = Array.from(nodeMap.values());
    graph.nodes = nodesArr;

    var links =[];

    for (var n = 0; n < nodesArr.length; n++){
      var node = nodesArr[n];
      var hp = node["HP"];
      if (hp) {
        for (var m = 0; m < hp.length; m++) {
          var target = nodeMap.get(hp[m]);
          links.push({"source":node, "target":target, "type":"HD"});
        }
      }
    }
    for (var n = 0; n < nodesArr.length; n++){
      var node = nodesArr[n];
      var hp = node["HI"];
      if (hp) {
        for (var m = 0; m < hp.length; m++) {
          var target = nodeMap.get(hp[m]);
          if (target){
            links.push({"source":node, "target":target, "type":"HI"});
          } else {
            console.log("missing ID! Yikes! " + hp[m]);
          }
        }
      }
    }

    graph.links = links;

    initialise(graph);

    // var mis = document.getElementById('mis').innerHTML;
    // initialise(JSON.parse(mis));
  }
);
