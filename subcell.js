d3.text("subcell.txt", function(text) {
    // if (error) throw error;

    var lines = text.split('\n');
    var currentLine = 0;
    while (lines[currentLine][0] !== '_'){
      // console.log(lines[currentLine]);
      currentLine++;
    }

    function cleanID (id) {
      id = id.trim().toUpperCase();
      //remove fullstop
      if (id[id.length - 1] == '.') {
        return id.substring(0, id.length - 1);
      }
      return id;
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
            // console.log(val);
            node = {"id":cleanID(val), "type":"ID"};
            break;
          case "IT":
            // console.log(val);
            node = {"id":cleanID(val), "type":"IT"};
            break;
          case "IO":
            // console.log(val);
            node = {"id":cleanID(val), "type":"IO"};
            break;
          case "//":
            if (node.type == "ID") {
              nodeMap.set(node.id, node);
            }
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
          var target = nodeMap.get(cleanID(hp[m]));
          links.push({"source":node, "target":target, "type":"HP"});
        }
      }
    }

    for (var n = 0; n < nodesArr.length; n++){
      var node = nodesArr[n];
      var hi = node["HI"];
      if (hi) {
        for (var m = 0; m < hi.length; m++) {
          var target = nodeMap.get(cleanID(hi[m]));
          if (target){
            links.push({"source":node, "target":target, "type":"HI"});
          } else {
            console.log("missing ID! Yikes! " + hi[m]);
          }
        }
      }
    }

    for (var n = 0; n < nodesArr.length; n++){
      var node = nodesArr[n];
      var sl = node["SL"];
      if (sl) {
        sl = sl[0].split(",");
        for (var s = 0; s < sl.length; s++) {
          var target = nodeMap.get(cleanID(sl[s]));
          if (target != node){
            links.push({"source":node, "target":target, "type":"SL"});
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
