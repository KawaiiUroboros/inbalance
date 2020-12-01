


var sketchDist = function(p){
 
    p.points = [];
    p.clonePoints;
    p.purpleMain = {};
    p.greenMain = {};
    p.genPoints = function(width, height, quantity, rad) {
      p.greenMain.x = width / 2 + rad[0];
      p.purpleMain.x = width / 2 - rad[1];
    
      p.dist= function(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      }
    
      for (let i = 0; i < quantity; i++) {
        let dot = {
          x: Math.floor(Math.random() * width),
          y: Math.floor(Math.random() * height),
          r: 8,
          cls: Math.round(Math.random()),
        };
        let normX1 = p.map(dot.x, 0, width, 0, 1);
        let normX2 = p.map(dot.y, 0, height, 0, 1);
    
        if (
          (dot.cls && p.dist(dot, p.purpleMain) <= rad[1]) ||
          (!dot.cls && p.dist(dot,p.greenMain) <= rad[0])
        ) {
          p.points.push(dot);
          p.X1.push(normX1);
          p.X2.push(normX2);
          p.Y.push(dot.cls);
        } else {
          i--;
        }
      }
    }
    
    // Data
    p.X1 = [];
    p.X2 = [];
    p.Y = [];
     p.W1; p.W2; p.B;
    
    p.w1 = tf.variable(tf.scalar(Math.random()));
    p.w2 = tf.variable(tf.scalar(Math.random()));
    p.b = tf.variable(tf.scalar(Math.random()));
    p.learningRate = 0.9;
    p.optimizer = tf.train.sgd(p.learningRate);
    
    p.type = 1;
    
    p.moveClss = function() {
      let slider = p.select(".dist-ratio").elt;
      let sliderStep = slider.step;
      let sliderValue = slider.value;
      let cnvSegmentLen = p.gWidth / sliderStep / 6500;
    
      p.purpleMain.offset = sliderValue * cnvSegmentLen;
      p.greenMain.offset = -sliderValue * cnvSegmentLen;
    }
    
    p.resetPosClss = function() {
      p.greenMain.offset = 0;
      p.purpleMain.offset = 0;
      let slider = document.querySelector(".dist-ratio");
      slider.value = 0;
    }
    
    p.gWidth = 800,
    p.gHeight = 500,
    p.maxRad = 200;
    p.setup = function() {
      p.greenMain.offset = 0;
      p.purpleMain.offset = 0;
      p.greenMain.y = p.gHeight / 2;
      p.purpleMain.y = p.gHeight / 2;
    
      p.genPoints(p.gWidth, p.gHeight, 150, [p.maxRad / 2, p.maxRad / 2]);
      clonePoints = p.points.slice(0);
      let cnv = p.createCanvas(p.gWidth, p.gHeight);
      cnv.parent("chart-dist-cont");
    
      //SLIDER
      let sldr = { min: 0, max: 1, val: 0 };
      let elSldr = document.querySelector(".dist-ratio");
      elSldr.setAttribute("step", (sldr.max - sldr.min) / p.gWidth);
      elSldr.setAttribute("value", sldr.val);
      elSldr.addEventListener("input", p.moveClss);
    }
    
    p.predict = function(x1, x2) {
      return tf.sigmoid(p.w1.mul(x1).add(p.w2.mul(x2)).add(p.b));
    }
    
    p.loss=function(predictions, labels) {
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
    
    p.train = function(x1, x2, ys, numIterations = 1) {
      for (let iter = 0; iter < numIterations; iter++) {
        p.optimizer.minimize(() => p.loss(p.predict(x1, x2), ys));
      }
    }
    
    p.draw=function() {
      p.background(230);
    
      //POINTS
      for (let i = 0, l = p.points.length; i < l; i++) {
        p.noStroke();
        //              фиолетовый          зеленый
        p.points[i].cls ? p.fill(99, 64, 156) : p.fill(20, 120, 20);
        p.points[i].cls
          ? p.circle(p.points[i].x + p.purpleMain.offset, p.points[i].y,p.points[i].r)
          : p.circle(p.points[i].x + p.greenMain.offset,  p.points[i].y, p.points[i].r);
      }
      if (p.X1.length) {
        tf.tidy(() => {
          const x1 = tf.tensor(p.X1, [p.X1.length, 1]);
          const x2 = tf.tensor(p.X2, [p.X2.length, 1]);
          const ys = tf.tensor(p.Y,  [p.Y.length, 1]);
    
          p.train(x1, x2, ys);
    
          p.W1 = p.w1.dataSync()[0];
          p.W2 = p.w2.dataSync()[0];
          p.B =  p.b.dataSync()[0];
        });
        p.drawLine();
      }
    }
    
    p.coloringSepSides = function(x1, y1, x2, y2) {
      p.noStroke();
      p.colorMode(p.RGB, 255, 255, 255, 1);
      p.fill(99, 64, 156, 0.2);
    
      // PURPLE CLASS
      p.beginShape();
      p.vertex(x1, y1);
      p.vertex(x2, y2);
      p.vertex(0, p.gHeight);
      p.vertex(0, 0);
      p.beginContour();
      p.vertex(x1, y1);
      p.vertex(x2, y2);
      p.vertex(0, p.gHeight);
      p.vertex(0, 0);
      p.endContour();
      p.endShape(p.CLOSE);
    
      //GREEN CLASS
      p.fill(20, 120, 20, 0.2);
      p.beginShape();
      p.vertex(x1, y1);
      p.vertex(p.gWidth, 0);
      p.vertex(x2, y2);
      p.vertex(p.gWidth, p.gHeight);
      p.beginContour();
      p.vertex(x1, y1);
      p.vertex(x2, y2);
      p.vertex(p.gWidth, 0);
      p.vertex(p.gWidth, p.gHeight);
      p.endContour();
      p.endShape(p.CLOSE);
    }
    
    p.drawLine = function() {
      let m = -(p.W1 /p.W2);
      let c = -(p.B / p.W2);
    
      let x1 = 0.0;
      let y1 = m * x1 + c;
      let x2 = 1.0;
      let y2 = m * x2 + c;
    
      let denormX1 = Math.floor(p.map(x1, 0, 1, 0, p.width));
      let denormY1 = Math.floor(p.map(y1, 0, 1, 0, p.height));
      let denormX2 = Math.floor(p.map(x2, 0, 1, 0, p.width));
      let denormY2 = Math.floor(p.map(y2, 0, 1, 0, p.height));
    
      p.stroke(0);
    
      p.line(denormX1, denormY1, denormX2, denormY2);
    
      p.coloringSepSides(denormX1, denormY1, denormX2, denormY2);
    }
    }
var sketch = function(p){
 
  p.setup = function(){
    p.greenMain.y = p.gHeight / 2;
    p.purpleMain.y = p.gHeight / 2;
    p.genPoints(p.gWidth, p.gHeight, 150, [p.maxRad / 2, p.maxRad / 2]);
    let cnv = p.createCanvas(p.gWidth, p.gHeight);
    cnv.parent("chart-size-cont");
    // select("#chart-cont");
  
    //SLIDER
    let sldr = { min: 0, max: 1, val: 0.5 };
    let elSldr = document.querySelector(".size-ratio");
    elSldr.setAttribute("step", (sldr.max - sldr.min) / p.gWidth);
    elSldr.setAttribute("value", sldr.val);
    elSldr.addEventListener("input", p.sizeProportions);
    elSldr.addEventListener("mousedown", () => {
      function slideTrue() {
        // console.log('object :>> ', elSldr.value);
        p.isSlide = true;
      }
      elSldr.addEventListener("mousemove", slideTrue);
      elSldr.addEventListener("mouseup", () => {
        elSldr.removeEventListener("mousemove", slideTrue);
        p.isSlide = false;
      });
    });

    p.draw = function(){
      p.background(230);

      //POINTS
      for (let i = 0, l = p.points.length; i < l; i++) {
        p.noStroke();
        p.points[i].cls ? p.fill(99, 64, 156) : p.fill(20, 120, 20);
        p.circle(p.points[i].x, p.points[i].y, p.points[i].r);
      }
    
      // херхерхерхер
      if (p.X1.length && !p.isSlide) {
        tf.tidy(() => {
          const x1 = tf.tensor(p.X1, [p.X1.length, 1]);
          const x2 = tf.tensor(p.X2, [p.X2.length, 1]);
          const ys = tf.tensor(p.Y, [p.Y.length, 1]);
    
          p.train(x1, x2, ys);
    
          p.W1 = p.w1.dataSync()[0];
          p.W2 = p.w2.dataSync()[0];
          p.B = p.b.dataSync()[0];
        });
        p.drawLine();
      }
    }
  }
  p.purpleMain = {},
  p.greenMain = {};
  p.points = [];
  p.drawLine = function() {
    let m = -(p.W1 / p.W2);
    let c = -(p.B / p.W2);
  
    let x1 = 0.0;
    let y1 = m * x1 + c;
    let x2 = 1.0;
    let y2 = m * x2 + c;
  
    let denormX1 = Math.floor(p.map(x1, 0, 1, 0, p.width));
    let denormY1 = Math.floor(p.map(y1, 0, 1, 0, p.height));
    let denormX2 = Math.floor(p.map(x2, 0, 1, 0, p.width));
    let denormY2 = Math.floor(p.map(y2, 0, 1, 0, p.height));
  
    p.stroke(0);
  
    p.line(denormX1, denormY1, denormX2, denormY2);
  
    p.coloringSepSides(denormX1, denormY1, denormX2, denormY2);
  }
  p.genPoints = function(width, height, quantity, rad) {
    p.greenMain.x = width / 2 + rad[0] - 5;
    p.purpleMain.x = width / 2 - rad[1] + 5;
  
    p.dist = function(p1, p2) {
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
        p.map(dot.x, 0, width, 0, 1);
      let normX2 =
        //dot.y / height;
        p.map(dot.y, 0, height, 0, 1);
  
      if (dot.cls && p.dist(dot, p.purpleMain) <= rad[1]) {
        p.points.push(dot);
        p.X1.push(normX1);
        // console.log(dot.x)
        p.X2.push(normX2);
        p.Y.push(dot.cls);
      } else if (!dot.cls && p.dist(dot, p.greenMain) <= rad[0]) {
        p.points.push(dot);
        p.X1.push(normX1);
        // console.log(dot.x)
        p.X2.push(normX2);
        p.Y.push(dot.cls);
      } else {
        i--;
      }
    }
  }
  p.X1 = [];
  p.X2 = [];
  p.Y = [];
  
  p.W1; p.W2; p.B;
  
  p.w1 = tf.variable(tf.scalar(Math.random()));
  p.w2 = tf.variable(tf.scalar(Math.random()));
  p.b = tf.variable(tf.scalar(Math.random()));
  p.learningRate = 0.9;
  p.optimizer = tf.train.sgd(p.learningRate);
  
  p.type = 1;
  
  p.sizeProportions = function() {
    // console.log('object', points)
    p.points = [];
    p.X2 = [];
    p.X1 = [];
    p.Y = [];
    let slider = p.select(".size-ratio").elt;
    let percPurple = Math.round((+slider.value / +slider.max) * 100);
    let percGreen = 100 - percPurple;
    let percRad = p.maxRad / 100;
    // console.log('perc :>> ', percPurple, percGreen);
  
    p.genPoints(p.gWidth, p.gHeight, 60, [percRad * percGreen, percRad * percPurple]);
    // drawDots();
  }
  p.gWidth = 800,
  p.gHeight = 500,
  p.maxRad = 200,
  p.isSlide = false;
  p.predict = function(x1, x2) {
    return tf.sigmoid(p.w1.mul(x1).add(p.w2.mul(x2)).add(p.b));
  }
  
  p.loss = function(predictions, labels) {
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
  
  p.train = function(x1, x2, ys, numIterations = 1) {
    for (let iter = 0; iter < numIterations; iter++) {
      p.optimizer.minimize(() => p.loss(p.predict(x1, x2), ys));
    }
  }
  
  
  
p.coloringSepSides = function(x1, y1, x2, y2) {
    p.noStroke();
    p.colorMode(p.RGB, 255, 255, 255, 1);
    p.fill(99, 64, 156, .2);
    
    // PURPLE CLASS
    p.beginShape();
    p.vertex(x1, y1);
    p.vertex(x2, y2);
    p.vertex(0, p.gHeight);
    p.vertex(0, 0);
    p.beginContour();
    p.vertex(x1, y1);
    p.vertex(x2, y2);
    p.vertex(0, p.gHeight);
    p.vertex(0, 0);
    p.endContour();
    p.endShape(p.CLOSE);
  
    //GREEN CLASS
    p.fill(20, 120, 20, .2);
    p.beginShape();
    p.vertex(x1, y1);
    p.vertex(p.gWidth, 0);
    p.vertex(x2, y2);
    p.vertex(p.gWidth, p.gHeight);
    p.beginContour();
    p.vertex(x1, y1);
    p.vertex(x2, y2);
    p.vertex(p.gWidth, 0);
    p.vertex(p.gWidth, p.gHeight);
    p.endContour();
    p.endShape(p.CLOSE);
  }
  
}
var sizep5 = new p5(sketch);
var dist5p2 = new p5(sketchDist);


