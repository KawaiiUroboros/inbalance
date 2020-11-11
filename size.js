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
    .append("g")
    .attr("class", "y axis")
    .call(d3.svg.axis().scale(y).orient("left"));
  svg
    .append("text")
    .attr("class", "y-label")
    .attr("transform", "translate(" + -two_third + "," + height / 2 + ")")
    .text("Y");
}

points = [];
function genPoints(width, height) {
  let purpleMain = {
    x: 90,
    y: 150, r: 8
  };
  let greenMain = {
    x: 320,
    y: 150, r: 8
  };
  point(greenMain);point(purpleMain);
  let around = 150;
  // point(xMainPurple, yMainPurple, 4, 1, 6);
  // point(xMainGreen, yMainGreen, 4, 0, 6);

  // function inRadius(p1, p2, r) {
  //   return Math.sqrt(Math.pow(p2.x - p1.x, 2)
  //   + Math.pow(p2.y - p1.y, 2)) <= r;
  //   }

  function dist(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  for (let i = 0; i < 30; i++) {
    let dot = {
      x: Math.floor(Math.random() * around) - around / 2,
      y: Math.floor(Math.random() * around) - around / 2,
      r: 4,
      cls: Math.round(Math.random())
    };

    if (dot.cls) {
      if (dist(dot, purpleMain) <= around) {
        dot.x += purpleMain.x;
        dot.y += purpleMain.y;
        points.push(dot);
      } 
    } else {
      if (dist(dot, greenMain) <= around) {
        dot.x += greenMain.x;
        dot.y += greenMain.y;
        points.push(dot);
      } 
    }

    // cls
    //   ? point(xPoint + xMainPurple, yPoint + yMainPurple, 4, cls)
    //   : point(xPoint + xMainGreen, yPoint + yMainGreen, 4, cls);
  }
}

function drawDots() {
  for (let i = 0, l = points.length; i < l; i++) {
    point(points[i]);
  }
}

// x, y -- coords; cls -- class
function point({ x, y, r, cls }) {
  let fill = cls ? "purple" : "green";
  svg
    .append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", r)
    .attr("fill", fill);
}

function drawSizeSep({ x, y, w, len }) {
  let fill = "purple";
  svg
    .append("line")
    .attr("x1", x)
    .attr("y1", y)
    .attr("x2", x)
    .attr("y2", y + len)
    .style("stroke", fill)
}

function addSlider(min, max, value, step) {
  let label = container.append("div").append("label");
  label.append("p").text("Accuracy");
  label
    .append("input")
    .attr("type", "range")
    .attr("class", "size-ratio")
    .attr("min", min)
    .attr("max", max)
    .attr("step", (max - min) / step)
    .attr("value", value);
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

  let sizeSepOptions = {
    len: height,
    // w: 8,
    x: width / 2,
    y: 0, // 75 -- len / 2
  };

  axes(width, height, margin);
  genPoints(width, height);
  drawDots();
  drawSizeSep(sizeSepOptions);
  addSlider(0, 1, 0.4, 5);
};
