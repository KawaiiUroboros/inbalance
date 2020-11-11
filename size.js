let container, svg, x, y, line;

if (typeof size === "undefined") size = {};

function axes(width, height, margin) {
  two_third = (margin * 2) / 3;
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.svg.axis().scale(x).orient("bottom"));
  svg
    .append("text")
    .attr("class", "x-label")
    .attr(
      "transform",
      "translate(" + width / 2 + "," + (height + two_third) + ")"
    )
    .text("X");
  svg
    .append("text")
    .attr("class", "x-label2")
    .attr(
      "transform",
      "translate(" +
        (width / 2 + 3.3 * two_third) +
        "," +
        (height - two_third / 2) +
        ")"
    )
    .text("False Positive Probability");

  svg
    .append("g")
    .attr("class", "y axis")
    .call(d3.svg.axis().scale(y).orient("left"));
  svg
    .append("text")
    .attr("class", "y-label")
    .attr("transform", "translate(" + -two_third + "," + height / 2 + ")")
    .text("Y");
}

function genPoints(width, height) {
  let xMainPurple = 90,
    yMainPurple = 150;

  let xMainGreen = 320,
    yMainGreen = 150;

  point(xMainPurple, yMainPurple, 4, 1, 6);
  point(xMainGreen, yMainGreen, 4, 0, 6);

  let around = 150;
  for (let i = 0; i < 30; i++) {
    let xPoint = Math.floor(Math.random() * around) - around / 2;
    let yPoint = Math.floor(Math.random() * around) - around / 2;
    let cls = Math.round(Math.random());

    cls
      ? point(xPoint + xMainPurple, yPoint + yMainPurple, 4, cls)
      : point(xPoint + xMainGreen, yPoint + yMainGreen, 4, cls);
  }
}

// x, y -- coords; cls -- class
function point(x, y, r, cls) {
  let fill = cls ? "purple" : "green";
  svg
    .append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", r)
    .attr("fill", fill);
}

function drawSizeSep(){
    
}

function addSlider(min, max, step) {
  container
    .append("div")
    .append("input")
    .attr("type", "range")
    .attr("class", "size-ratio")
    .attr("min", min)
    .attr("max", max)
    .attr("step", step);
}

size.init = function (id, width, height, margin) {
  container = d3.select("#" + id);
  (x = d3.scale.linear().domain([0, 1]).range([0, width])),
    (y = d3.scale.linear().domain([0, 1]).range([height, 0]));
  line = d3.svg
    .line()
    .x(function (d) {
      return x(d.x);
    })
    .y(function (d) {
      return y(d.y);
    });
  svg = container
    .append("svg")
    .attr("width", width + 2 * margin)
    .attr("height", height + 2 * margin)
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");

  axes(width, height, margin);
  genPoints(width, height);
  addSlider(0, 1, 0.2);
};
