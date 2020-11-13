if (typeof size === "undefined") size = {};

// function axes(width, height, margin) {
//   two_third = (margin * 2) / 3;
//   svg
//     .append("g")
//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.svg.axis().scale(x).orient("bottom"));
//   svg
//     .append("text")
//     .attr("class", "x-label")
//     .attr(
//       "transform",
//       "translate(" + width / 2 + "," + (height + two_third) + ")"
//     )
//     .text("X");

//   svg
//     .append("g")
//     .attr("class", "y axis")
//     .call(d3.svg.axis().scale(y).orient("left"));
//   svg
//     .append("text")
//     .attr("class", "y-label")
//     .attr("transform", "translate(" + -two_third + "," + height / 2 + ")")
//     .text("Y");
// }

points = [];
let purpleMain = {
    x: 170,
    y: 150,
  },
  greenMain = {
    x: 225,
    y: 150,
  };
function genPoints(width, height, quantity, rad) {
  greenMain.x = width / 2 + rad[0] - 5;
  purpleMain.x = width / 2 - rad[1] + 5;

  function dist(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  for (let i = 0; i < quantity; i++) {
    let dot = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      r: 8,
      cls: Math.round(Math.random()),
    };

    if (dot.cls && dist(dot, purpleMain) <= rad[1]) {
      points.push(dot);
    } else if (!dot.cls && dist(dot, greenMain) <= rad[0]) {
      points.push(dot);
    } else {
      i--;
    }
  }
}

// function drawDots() {
//   for (let i = 0, l = points.length; i < l; i++) {
//     drawPoint(points[i]);
//   }
// }

// x, y -- coords; cls -- class
// function drawPoint({ x, y, r, cls }) {
//   let fill = cls ? "purple" : "green";
//   svg
//     .append("circle")
//     .attr("class", `cls-${cls}`)
//     .attr("cx", x)
//     .attr("cy", y)
//     .attr("r", r)
//     .attr("fill", fill);
// }

// function drawSizeSep(w, h) {
// line(w / 2, 0, w / 2, h);
// let fill = "purple";
// svg
//   .append("line")
//   .attr("class", "sep")
//   .attr("x1", x)
//   .attr("y1", y)
//   .attr("x2", x)
//   .attr("y2", y + len)
//   .style("stroke", fill);
// }

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
    .attr("value", value)
    .on("input", () => {
      sizeProportions();
    });
}

function sizeProportions() {
  // console.log('object', points)
  points = [];
  d3.selectAll(".cls-1").remove();
  d3.selectAll(".cls-0").remove();

  //   let xScale = d3.scale
  //     .linear()
  //     .domain([+slider.min, +slider.max])
  //     .range([0, w])
  //     .clamp(true);
  let slider = d3.select(".size-ratio")[0][0];
  // let scale = d3.scale
  //   .linear()
  //   .domain([+slider.min, +slider.max])
  //   .range([0, maxRad])
  //   .clamp(true);

  let percPurple = Math.round((+slider.value / +slider.max) * 100);
  let percGreen = 100 - percPurple;
  let percRad = maxRad / 100;
  // console.log('perc :>> ', percPurple, percGreen);

  genPoints(gWidth, gHeight, 60, [percRad * percGreen, percRad * percPurple]);
  // drawDots();
}
// для третьего графика
// function connectSliderSep(w) {
//   let slider = d3.select(".size-ratio")[0][0];
//   let sep = d3.select(".sep");

//   let xScale = d3.scale
//     .linear()
//     .domain([+slider.min, +slider.max])
//     .range([0, w])
//     .clamp(true);

//   sep
//   .attr("x1", `${xScale(slider.value)}px`)
//   .attr("x2", `${xScale(slider.value)}px`);
// }
let gWidth = 400,
  gHeight = 300,
  maxRad = 100;
function setup() {
  genPoints(gWidth, gHeight, 150, [maxRad, maxRad]);
  let cnv = createCanvas(gWidth, gHeight);
  cnv.parent("chart-cont");
  // select("#chart-cont");

  //SLIDER
  let sldr = { min: 0, max: 1, val: 0.5, step: 0.2};
  let elSldr = document.querySelector(".size-ratio");
  elSldr.setAttribute("step", (sldr.max - sldr.min) / gWidth);
  elSldr.addEventListener('input', sizeProportions);
  // let elSldr = createSlider(0, 1, 0.5, (sldr.max - sldr.min) / gWidth)
  // .parent('#chart-cont');
  // console.log('elSldr :>> ', elSldr);
}

function draw() {
  background(230);

  //POINTS
  for (let i = 0, l = points.length; i < l; i++) {
    noStroke();
    points[i].cls ? fill(99, 64, 156) : fill(20, 120, 20);
    circle(points[i].x, points[i].y, points[i].r);
  }

  // SEPARATOR
  stroke("purple");
  line(gWidth / 2, 0, gWidth / 2, gHeight);
  // drawSizeSep(gWidth, gHeight);
}
// size.init = function (id, width, height, margin) {
// gWidth = width;
// gHeight = height;

// container = d3.select("#" + id);
// (x = d3.scale.linear().domain([0, 1]).range([0, width])),
//   (y = d3.scale.linear().domain([0, 1]).range([height, 0]));

// svg = container
//   .append("svg")
//   .attr("width", width + 2 * margin)
//   .attr("height", height + 2 * margin)
//   .append("g")
//   .attr("transform", "translate(" + margin + "," + margin + ")");

// let sizeSepOptions = {
//   len: height,
//   x: width / 2,
//   y: 0,
// };

// maxRad = 100;

// axes(width, height, margin);
// genPoints(width, height, 150, [maxRad, maxRad]);
// drawDots();
// setup();
// draw();
// drawSizeSep(sizeSepOptions);
// addSlider(0, 1, 0.5, 50, width);
// };
