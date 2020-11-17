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
let purpleMain = {},
  greenMain = {};
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
    let normX1 =
      //dot.x / width;
      map(dot.x, 0, width, 0, 1);
    let normX2 =
      //dot.y / height;
      map(dot.y, 0, height, 0, 1);

    if (dot.cls && dist(dot, purpleMain) <= rad[1]) {
      points.push(dot);
      X1.push(normX1);
      // console.log(dot.x)
      X2.push(normX2);
      Y.push(dot.cls);
    } else if (!dot.cls && dist(dot, greenMain) <= rad[0]) {
      points.push(dot);
      X1.push(normX1);
      // console.log(dot.x)
      X2.push(normX2);
      Y.push(dot.cls);
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

// Data
X1 = [];
X2 = [];
Y = [];

var W1, W2, B;

const w1 = tf.variable(tf.scalar(Math.random()));
const w2 = tf.variable(tf.scalar(Math.random()));
const b = tf.variable(tf.scalar(Math.random()));
const learningRate = 0.9;
const optimizer = tf.train.sgd(learningRate);

var type = 1;

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

// function addSlider(min, max, value, step) {
//   let label = container.append("div").append("label");
//   label.append("p").text("Accuracy");
//   label
//     .append("input")
//     .attr("type", "range")
//     .attr("class", "size-ratio")
//     .attr("min", min)
//     .attr("max", max)
//     .attr("step", (max - min) / step)
//     .attr("value", value)
//     .on("input", () => {
//       sizeProportions();
//     });
// }

function sizeProportions() {
  // console.log('object', points)
  points = [];
  X2 = [];
  X1 = [];
  Y = [];

  // selectAll(".cls-1").remove();
  // selectAll(".cls-0").remove();
  // removeElements('.cls-1');
  // removeElements('.cls-0');

  //   let xScale = d3.scale
  //     .linear()
  //     .domain([+slider.min, +slider.max])
  //     .range([0, w])
  //     .clamp(true);
  let slider = select(".size-ratio").elt;
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
let gWidth = 800,
  gHeight = 500,
  maxRad = 200,
  isSlide = false;
function setup() {
  greenMain.y = gHeight / 2;
  purpleMain.y = gHeight / 2;
  genPoints(gWidth, gHeight, 150, [maxRad / 2, maxRad / 2]);
  let cnv = createCanvas(gWidth, gHeight);
  cnv.parent("chart-size-cont");
  // select("#chart-cont");

  //SLIDER
  let sldr = { min: 0, max: 1, val: 0.5 };
  let elSldr = document.querySelector(".size-ratio");
  elSldr.setAttribute("step", (sldr.max - sldr.min) / gWidth);
  elSldr.setAttribute("value", sldr.val);
  elSldr.addEventListener("input", sizeProportions);
  elSldr.addEventListener("mousedown", () => {
    function slideTrue() {
      // console.log('object :>> ', elSldr.value);
      isSlide = true;
    }
    elSldr.addEventListener("mousemove", slideTrue);
    elSldr.addEventListener("mouseup", () => {
      elSldr.removeEventListener("mousemove", slideTrue);
      isSlide = false;
    });
  });
  // let elSldr = createSlider(0, 1, 0.5, (sldr.max - sldr.min) / gWidth)
  // .parent('#chart-cont');
  // console.log('elSldr :>> ', elSldr);
}

// function drawLine() {
//   // console.log('lineCoords :>> ', lineCoords);
//   let m = -(W1 / W2);
//   let c = -(B / W2);

//   let x1 = 0.0;
//   let y1 = m * x1 + c;
//   let x2 = 1.0;
//   let y2 = m * x2 + c;
//   let denormX1 = Math.floor(map(x1, 0, 1, 0, width));
//   let denormY1 = Math.floor(map(y1, 0, 1, 0, height));
//   let denormX2 = Math.floor(map(x2, 0, 1, 0, width));
//   let denormY2 = Math.floor(map(y2, 0, 1, 0, height));
//   //let denormX1 = x1 * width;
//   //let denormY1 = y1 * height;
//   //let denormX2 = x2 * width;
//   //let denormY2 = y2 * height;

//   stroke(255);
//   line(denormX1, denormY1, denormX2, denormY2);
// }

function predict(x1, x2) {
  return tf.sigmoid(w1.mul(x1).add(w2.mul(x2)).add(b));
}

function loss(predictions, labels) {
  return tf.scalar(0).sub(
    tf.mean(
      labels.mul(tf.log(predictions)).add(
        tf
          .scalar(1)
          .sub(labels)
          .mul(tf.log(tf.scalar(1).sub(predictions)))
      )
    )
  );
}

function train(x1, x2, ys, numIterations = 1) {
  for (let iter = 0; iter < numIterations; iter++) {
    optimizer.minimize(() => loss(predict(x1, x2), ys));
  }
}

function draw() {
  background(230);

  //POINTS
  for (let i = 0, l = points.length; i < l; i++) {
    noStroke();
    points[i].cls ? fill(99, 64, 156) : fill(20, 120, 20);
    circle(points[i].x, points[i].y, points[i].r);
  }

  // херхерхерхер
  if (X1.length && !isSlide) {
    tf.tidy(() => {
      const x1 = tf.tensor(X1, [X1.length, 1]);
      const x2 = tf.tensor(X2, [X2.length, 1]);
      const ys = tf.tensor(Y, [Y.length, 1]);

      train(x1, x2, ys);

      W1 = w1.dataSync()[0];
      W2 = w2.dataSync()[0];
      B = b.dataSync()[0];
    });
    drawLine();
  }
  // SEPARATOR

  // drawSizeSep(gWidth, gHeight);
}

function coloringSepSides(x1, y1, x2, y2) {
  noStroke();
  colorMode(RGB, 255, 255, 255, 1);
  fill(99, 64, 156, .2);
  
  // PURPLE CLASS
  beginShape();
  vertex(x1, y1);
  vertex(x2, y2);
  vertex(0, gHeight);
  vertex(0, 0);
  beginContour();
  vertex(x1, y1);
  vertex(x2, y2);
  vertex(0, gHeight);
  vertex(0, 0);
  endContour();
  endShape(CLOSE);

  //GREEN CLASS
  fill(20, 120, 20, .2);
  beginShape();
  vertex(x1, y1);
  vertex(gWidth, 0);
  vertex(x2, y2);
  vertex(gWidth, gHeight);
  beginContour();
  vertex(x1, y1);
  vertex(x2, y2);
  vertex(gWidth, 0);
  vertex(gWidth, gHeight);
  endContour();
  endShape(CLOSE);
}

function drawLine() {
  let m = -(W1 / W2);
  let c = -(B / W2);

  let x1 = 0.0;
  let y1 = m * x1 + c;
  let x2 = 1.0;
  let y2 = m * x2 + c;

  let denormX1 = Math.floor(map(x1, 0, 1, 0, width));
  let denormY1 = Math.floor(map(y1, 0, 1, 0, height));
  let denormX2 = Math.floor(map(x2, 0, 1, 0, width));
  let denormY2 = Math.floor(map(y2, 0, 1, 0, height));

  stroke(0);

  line(denormX1, denormY1, denormX2, denormY2);

  coloringSepSides(denormX1, denormY1, denormX2, denormY2);
  // translate(50, 50);
  // noStroke();
  // // fill(99, 64, 156) : fill(20, 120, 20);
  // colorMode(RGB, 255, 255, 255, 1);
  // fill(99, 64, 156, .2);
  // beginShape();
  // // Exterior part of shape, clockwise winding
  // vertex(denormX1, denormY1);
  // vertex(denormX2, denormY2);
  // vertex(0, gHeight);
  // vertex(0, 0);
  // // Interior part of shape, counter-clockwise winding
  // beginContour();
  // vertex(denormX1, denormY1);
  // vertex(denormX2, denormY2);
  // vertex(0, gHeight);
  // vertex(0, 0);
  // // vertex(-40, -40);
  // // vertex(40, -40);
  // // vertex(40, 40);
  // // vertex(-40, 40);
  // endContour();
  // endShape(CLOSE);
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
