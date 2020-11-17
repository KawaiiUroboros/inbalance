"use strict";

let WIDTH = document.documentElement.clientWidth,
  HEIGHT = document.documentElement.clientHeight;

// document.addEventListener("resize", () => {
//     WIDTH = document.documentElement.clientWidth,
//     HEIGHT = document.documentElement.clientHeight;
//     createCanvas(WIDTH, HEIGHT);
// });

function getDist(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

let dots = [];
function genDots(q, r, speed) {
  for (let i = 0, l = q; i < l; i++) {
    dots.push({
      x: 5 + Math.random() * (WIDTH - 10),
      y: 5 + Math.random() * (HEIGHT - 10),
      r: r[0] + Math.random() * r[1],
      speedX: Math.random() * speed - speed / 2,
      speedY: Math.random() * speed - speed / 2,
      //   dir: randomInteger(1, 4),
    });
  }
}

let distance = 80;
function setup() {
  createCanvas(WIDTH, HEIGHT);
  genDots(80, [10, 16], 1.7);
}

function draw() {
  background(230);
  colorMode(RGB, 255, 255, 255, 1);
  fill(23, 162, 184, 0.7);
  noStroke();
  rect(0, 0, WIDTH, HEIGHT);

  for (let i = 0, l = dots.length; i < l; i++) {
    circle(dots[i].x, dots[i].y, dots[i].r);

    for (let j = 0; j < l; j++) {
      if (getDist(dots[i], dots[j]) <= distance) {
        stroke(23, 162, 184);
        line(dots[i].x, dots[i].y, dots[j].x, dots[j].y);
      }
    }

    if (dots[i].x >= WIDTH) {
      dots[i].x = 0;
    } else if (dots[i].y >= HEIGHT) {
      dots[i].y = 0;
    } else if (dots[i].x <= 0) {
      dots[i].x = WIDTH;
    } else if (dots[i].y <= 0) {
      dots[i].y = HEIGHT;
    }

    dots[i].x += dots[i].speedX;
    dots[i].y += dots[i].speedY;

    // switch (dots[i].dir) {
    //   case 1:
    //     dots[i].x -= dots[i].speed;
    //     dots[i].y += dots[i].speed;
    //     break;
    //   case 2:
    //     dots[i].x += dots[i].speed;
    //     dots[i].y -= dots[i].speed;
    //     break;
    //   case 3:
    //     dots[i].x += dots[i].speed;
    //     dots[i].y += dots[i].speed;
    //     break;
    //   case 4:
    //     dots[i].x -= dots[i].speed;
    //     dots[i].y -= dots[i].speed;
    //     break;
    // }
  }
}
