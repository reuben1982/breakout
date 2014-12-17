var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var WIDTH = canvas.width;
var HEIGHT = canvas.height;
var last_time, elapsed_time, now;

function rect(shape) {
  context.fillStyle = shape.color;
  context.beginPath();
  context.rect(shape.x, shape.y, shape.w, shape.h);
  context.fill();
  context.closePath();
}

function circle(c) {
  context.fillStyle = c.color;
  context.beginPath();
  context.arc(c.x, c.y, c.r, 0, Math.PI*2, true);
  context.fill();
  context.closePath();
}

function clear() {context.clearRect(0,0,WIDTH,HEIGHT); }

var paddle = {
  w: 60,
  h: 15,
  y: HEIGHT - 30,
  color: "white"
}

paddle.x = WIDTH/2 - paddle.w/2;

var ball = {
  r: 8,
  y: HEIGHT - 45,
  dx: 150, // speed is in pixels per second
  dy: -150, // up is negative!
  color: "white"
}
ball.x = WIDTH/2;// arc is already centered!

var fps = 100;
function move() {
  // move the ball around
  if (ball.x < 0 || ball.x > WIDTH) { ball.dx = -ball.dx }
  if (ball.y < 0 || ball.y > HEIGHT) { ball.dy = -ball.dy }

  //(pixels per second)/(frames per second) = pixels per frame
  ball.x += ball.dx/fps; 
  ball.y += ball.dy/fps;
  
  if (leftDown) {
    paddle.x -= paddle.dx/fps;
  }
  if (rightDown) {
    paddle.x += paddle.dx/fps;
  }
  if (paddle.x > WIDTH-paddle.w) {
	paddle.x = WIDTH-paddle.w
  }
  if (paddle.x < 0) {
	 paddle.x = 0
  }
  
}
var rightDown = false;
var leftDown = false;

//set rightDown or leftDown if the right or left keys are down
function onKeyDown(event) {
 
  if (event.keyCode == 39) rightDown = true;
  else if (event.keyCode == 37) leftDown = true;
}

//and unset them when the right or left key is released
function onKeyUp(event) {
  if (event.keyCode == 39) rightDown = false;
  else if (event.keyCode == 37) leftDown = false;
}

document.addEventListener("keydown",onKeyDown);
document.addEventListener("keyup",onKeyUp);

//where paddle is defined, give the paddle a dx
paddle.dx = 200;
function draw() {
  clear();

  // draw ball
  circle(ball);
  rect(paddle);
  // draw 
  for (var i=0;i<bricks.length;i++) {
    b = bricks[i];
    if (!b.broken) {
      rect(b);
    }
}
}
function collide(ball,brick) {
  var out = { x: false, y: false };
  var d_left = ball.x - brick.x + ball.r;
  var d_right = brick.x + brick.w - ball.x + ball.r;
  var d_top = ball.y - brick.y + ball.r;
  var d_bot = brick.y + brick.h - ball.y + ball.r;
  if (d_left > 0 && d_right > 0 && d_top > 0 && d_bot > 0) {
    if (Math.min(d_left,d_right) > Math.min(d_top,d_bot)) {
      out.y = true;
    }
    else {
      out.x = true;
    }
  }
  return out;
}

var last_time, elapsed_time, now;
function tick() {
  now = new Date().valueOf();
  elapsed_time = (now-last_time)/1000;
  last_time = now;
  detect_collision();
  move();
  draw();
  current_frame = window.requestAnimationFrame(tick);
}

function start() {
  now = new Date().valueOf();
  last_time = new Date().valueOf();
  current_frame = window.requestAnimationFrame(tick);
}
function stop() {
  cancelAnimationFrame(current_frame);
}

function detect_collision() {
 for (var i=0;i<bricks.length;i++) {
    var _b = bricks[i];
	
    if (!_b.broken) {
      var _c = collide(ball,_b);
         if (_c.x || _c.y) { //if broken on either x or y side...
				_b.hits--
					_b.color = "cyan";
				if (_b.hits < 2) {
				  	_b.color = "purple"; // set broken to true...
				  } 
				  // HIT
				 console.log(_b.hits);
				  if (_b.hits < 1) {
				  _b.broken = true; // set broken to true...
				  } 

        if (_c.x) { ball.dx = -ball.dx*Math.random()*10;}//ball direction
        if (_c.y) { ball.dy = -ball.dy}
        continue;
      }
    }
  }
  
  _c = collide(ball,paddle);
  if (_c.x || _c.y) {
    ball.dy = - ball.dy;
  }
}


function createBricks(o) {
  var out = [], x, y, col_max, color;
  var colors = ["red","green","blue","yellow"];
  for (var row=0; row<o.rows; row++) {
    col_max = Math.floor(WIDTH / (o.w + o.separation));
    if (row%2 == 0) { col_max -=1; }
    y = (row+3)*(o.h + o.separation) + o.separation;
    for (var col=0; col<col_max; col++) {
      x = col*(o.separation + o.w) + o.separation;
      if (row%2 == 0) { x += o.w/2; }
      color = colors[Math.floor((row+col)%colors.length)];
      out.push({x: x, y: y, w: o.w, h: o.h, color: color, broken: false, hits: 3});
    }
  }
  return out;
}

var brick_options = {w: 40, h: 15, separation: 5, canvas: canvas, rows: 4};
var bricks = createBricks(brick_options);


