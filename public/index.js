
var width = 960;
var height = 600;

var rateById = d3.map();

var quantize = d3.scale.quantize()
  .domain([0, 50])
  .range(d3.range(4).map(function(i) { return "q" + i; }));

var projection = d3.geo.albersUsa()
  .scale(1280)
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

queue()
  .defer(d3.json, "us.json")
  .defer(d3.csv, "fips.csv", function(d) { 
    rateById.set(d.id, + d.count); })
  .await(ready);

function ready(error, us) {
  svg.append("g")
    .attr("class", "counties")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("class", function(d) {
        var q = quantize(rateById.get(d.id));
        return "county " + q; 
      })
      .attr("d", path);

  svg.append("path")
    .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
    .attr("class", "states")
    .attr("d", path);
}

d3.select(self.frameElement).style("height", height + "px");
