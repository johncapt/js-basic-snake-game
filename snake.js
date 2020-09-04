"use strict";
const CST_CANVAS = document.getElementById("canvas");
const CST_CTX = CST_CANVAS.getContext("2d");
const CST_SCALE = 20;
const CST_ROWS = CST_CANVAS.height / CST_SCALE;
const CST_COLS = CST_CANVAS.width / CST_SCALE;

let snake;

function Fruit() {
  this.x;
  this.y;
  this.setRandomLocation = function () {
    this.x = (Math.floor(Math.random() * CST_COLS - 1) + 1) * CST_SCALE;
    this.y = (Math.floor(Math.random() * CST_ROWS - 1) + 1) * CST_SCALE;
  };
  this.draw = function () {
    CST_CTX.fillStyle = "green";
    CST_CTX.fillRect(this.x, this.y, CST_SCALE, CST_SCALE);
  };
}

function Snake() {
  this.alive = true;
  this.moves = 0;
  this.x = (Math.floor(Math.random() * CST_COLS - 1) + 1) * CST_SCALE;
  this.y = this.x;
  this.xSpeed = CST_SCALE;
  this.ySpeed = 0;
  this.total = 0;
  this.tail = [];

  this.update = function () {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }
    this.tail[this.total - 1] = { x: this.x, y: this.y };
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  };

  this.draw = function () {
    for (let i = 0; i < this.tail.length; i++) {
      CST_CTX.fillStyle = i == 0 ? "orange" : "yellow";
      CST_CTX.fillRect(this.tail[i].x, this.tail[i].y, CST_SCALE, CST_SCALE);
    }
    CST_CTX.fillRect(this.x, this.y, CST_SCALE, CST_SCALE);
  };

  this.changeDirection = function (direction) {
    switch (direction) {
      case "Up":
        this.xSpeed = 0;
        this.ySpeed = -CST_SCALE;
        break;
      case "Down":
        this.xSpeed = 0;
        this.ySpeed = CST_SCALE;
        break;
      case "Left":
        this.xSpeed = -CST_SCALE;
        this.ySpeed = 0;
        break;
      case "Right":
        this.xSpeed = CST_SCALE;
        this.ySpeed = 0;
        break;
    }
  };
  this.eat = function (fruit) {
    if (this.x === fruit.x && this.y === fruit.y) {
      this.moves = 0;
      this.total++;
      return true;
    } else {
      this.moves++;
      return false;
    }
  };
  this.checkCollision = function () {
    // check collision with walls
    if (
      this.x < 0 ||
      this.x > CST_CANVAS.width ||
      this.y < 0 ||
      this.y > CST_CANVAS.height
    ) {
      this.alive = false;
    } else {
      // check collision with itself
      for (var i = 0; i < this.tail.length; i++) {
        if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
          this.alive = false;
        }
      }
    }
  };
}

(function setup() {
  snake = new Snake();
  let fruit = new Fruit();
  fruit.setRandomLocation();

  window.setInterval(() => {
    if (snake.alive) {
      CST_CTX.clearRect(0, 0, CST_CANVAS.width, CST_CANVAS.height);
      fruit.draw();
      snake.update();
      snake.draw();
      if (snake.eat(fruit)) {
        fruit.setRandomLocation();
      }
      snake.checkCollision();
      updateDisplayParams();
    }
  }, 100);
})();

function updateDisplayParams() {
  document.getElementById("gameScore").innerText = snake.total;
  document.getElementById(
    "snakePosition"
  ).innerText = `(${snake.x},${snake.y})`;
  document.getElementById("snakeNbMoves").innerText = snake.moves;
}

window.addEventListener("keydown", (evt) => {
  const direction = evt.key.replace("Arrow", "");
  snake.changeDirection(direction);
});
