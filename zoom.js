function mainjs(csv_path){
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

  // append the SVG object to the body of the page
  var SVG = d3.select("#dataviz_axisZoom")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  //Read the data
  d3.csv(csv_path, function(data) {
  var zoom = d3.zoom()
  .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
  .extent([[0, 0], [width, height]])
  .on("zoom", updateChart);
  SVG.append("rect")
  .attr("width", width)
  .attr("height", height)
  .style("fill", "none")
  .style("pointer-events", "all")
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .call(zoom);
  // Add X axis
  var x = d3.scaleLinear()
    .domain([-0.1, 1.1])
    .range([ 0, width ]);
  var xAxis = SVG.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-0.1, 1.1])
    .range([ height, 0]);
  var yAxis = SVG.append("g")
    .call(d3.axisLeft(y));

  // Add a clipPath: everything out of this area won't be drawn.
  var clip = SVG.append("defs").append("SVG:clipPath")
      .attr("id", "clip")
      .append("SVG:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0);

  // Create the scatter variable: where both the circles and the brush take place
  var scatter = SVG.append('g')
    .attr("clip-path", "url(#clip)")

  // Add circles
  scatter
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.heng); } )
      .attr("cy", function (d) { return y(d.shu); } )
      .attr("r", 4)
      .style("fill", "#61a3a9")
      .style("opacity", 0.5)
      .on("click", function (d) {
        // Code to be executed when a circle is clicked
        alert(Number(d.index).toFixed(0));
        // You can perform any other actions or display information here
      })
      .on("mouseover", function (d) {
        // Code to be executed when mouse is over the circle
        d3.select(this)
          .style("fill", "red")
          .attr("r", 8);
      })
      .on("mouseout", function (d) {
        // Code to be executed when mouse leaves the circle
        d3.select(this)
          .style("fill", "#61a3a9")
          .attr("r", 4);
      });

    //add text
    scatter
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
        .attr("x", function (d) { return x(d.heng) + 8; }) // ???????
        .attr("y", function (d) { return y(d.shu) - 8; }) // ???????
        .text(function (d) { return Number(d.index).toFixed(0); }) // ????
        .style("font-size", "8px") // ????
        .style("fill", "#000");

  // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
  /*
  var zoom = d3.zoom()
      .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
      .extent([[0, 0], [width, height]])
      .on("zoom", updateChart);
  */
  // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
  //????
  /*
  SVG.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom);
  */
  // now the user can zoom and it will trigger the function called updateChart

  // A function that updates the chart when the user zoom and thus new boundaries are available
  function updateChart() {

    // recover the new scale
    var newX = d3.event.transform.rescaleX(x);
    var newY = d3.event.transform.rescaleY(y);

    // update axes with these new boundaries
    xAxis.call(d3.axisBottom(newX))
    yAxis.call(d3.axisLeft(newY))

    // update circle position
    scatter
      .selectAll("circle")
      .attr('cx', function(d) {return newX(d.heng)})
      .attr('cy', function(d) {return newY(d.shu)});

    // ??????
    scatter
      .selectAll("text")
      .attr("x", function (d) { return newX(d.heng) + 8; })
      .attr("y", function (d) { return newY(d.shu) - 8; });
  }

  })
}
function alter_source(){
  var selectedValue = document.getElementById("source_id").value;
  alert(selectedValue);
  mainjs("http://127.0.0.1:8080/embedding.csv");
}
function alter_target(){
  var selectedValue = document.getElementById("target_id").value;
  alert(selectedValue);
}

var targetSinger = ["CDF1","CDM1"];
var temp2 = document.getElementById("target_id");
for(var i=0;i<targetSinger.length;i++){
    var op=document.createElement("option");
    var op_text = document.createTextNode(targetSinger[i]);
    op.appendChild(op_text);
    temp2.appendChild(op)
}

var source = ["1044003410","1086000103","1092002291","1100000814"];
var temp1 = document.getElementById("source_id");
for(var i=0;i<source.length;i++){
    var op=document.createElement("option");
    var op_text = document.createTextNode(source[i]);
    op.appendChild(op_text);
    temp1.appendChild(op);
}

mainjs("http://127.0.0.1:8080/encoder.csv");

