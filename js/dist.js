if (typeof size === "undefined") size = {};

points = [];
let clonePoints;
let purpleMain = {},
  greenMain = {};
function genPoints(width, height, quantity, rad) {
  greenMain.x = width / 2 + rad[0];
  purpleMain.x = width / 2 - rad[1];

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
    let normX1 = map(dot.x, 0, width, 0, 1);
    let normX2 = map(dot.y, 0, height, 0, 1);

    if (
      (dot.cls && dist(dot, purpleMain) <= rad[1]) ||
      (!dot.cls && dist(dot, greenMain) <= rad[0])
    ) {
      points.push(dot);
      X1.push(normX1);
      X2.push(normX2);
      Y.push(dot.cls);
    } else {
      i--;
    }
  }
}

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

function moveClss() {
  let slider = select(".dist-ratio").elt;
  let sliderStep = slider.step;
  let sliderValue = slider.value;
  let cnvSegmentLen = gWidth / sliderStep / 6500;

  purpleMain.offset = sliderValue * cnvSegmentLen;
  greenMain.offset = -sliderValue * cnvSegmentLen;
}

function resetPosClss() {
  greenMain.offset = 0;
  purpleMain.offset = 0;
  let slider = document.querySelector(".dist-ratio");
  slider.value = 0;
}

let gWidth = 800,
  gHeight = 500,
  maxRad = 200;
function setup() {
  greenMain.offset = 0;
  purpleMain.offset = 0;
  greenMain.y = gHeight / 2;
  purpleMain.y = gHeight / 2;

  genPoints(gWidth, gHeight, 150, [maxRad / 2, maxRad / 2]);
  clonePoints = points.slice(0);
  let cnv = createCanvas(gWidth, gHeight);
  cnv.parent("chart-dist-cont");

  //SLIDER
  let sldr = { min: 0, max: 1, val: 0 };
  let elSldr = document.querySelector(".dist-ratio");
  elSldr.setAttribute("step", (sldr.max - sldr.min) / gWidth);
  elSldr.setAttribute("value", sldr.val);
  elSldr.addEventListener("input", moveClss);
}

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
    //              фиолетовый          зеленый
    points[i].cls ? fill(99, 64, 156) : fill(20, 120, 20);
    points[i].cls
      ? circle(points[i].x + purpleMain.offset, points[i].y, points[i].r)
      : circle(points[i].x + greenMain.offset, points[i].y, points[i].r);
  }
  if (X1.length) {
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
}

function coloringSepSides(x1, y1, x2, y2) {
  noStroke();
  colorMode(RGB, 255, 255, 255, 1);
  fill(99, 64, 156, 0.2);

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
  fill(20, 120, 20, 0.2);
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
}
