// JavaScript Document
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight / 1;
const pi = Math.PI
let mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2
};
let i = 0;
let j = 0;
let increment = 1;

///////////////////////////////////////////////////

window.addEventListener('resize', function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

window.addEventListener('mousemove', function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;

});

//////////////////////////////////////////////////////////
function random() {
  return ((Math.random() - 0.5) * 16);
}
//Objects
const user1 = {
  x: 0,
  y: 0,
  z: 1,
  height: canvas.height / 5,
  width: canvas.width / 65,
  color: 'navy',
  level: undefined
};

const user2 = {
  x: canvas.width * (1 - 1 / 65),
  y: 20,
  z: 0,
  height: canvas.height / 5,
  width: canvas.width / 65,
  color: 'olive',
  level: 0.07
};


let orb = {
  x: canvas.width / 2,
  y: (Math.random() * canvas.height / 1.4) + canvas.width / 75,
  dx: undefined, //defined in init functio random value between [-8,-4]U[4,8]
  dy: undefined, //defined in init functio random value between [-8,-4]U[4,8]
  radius: canvas.width / 60,
  color: 'red'
};

/////////////////////////////////////////////////////////

function Paddle(x, y, z, width, height, color, level) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.width = width;
  this.height = height;
  this.color = color;
  this.level = level;

  this.draw = () => {
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.width, this.height);
  }

  this.update = () => {
    if (this.z == 1) {
      this.y = mouse.y - this.height / 2;
    }
    if (this.z == 0)
      if (ball.x > canvas.width / 2) {
        this.y += (ball.y - this.y - this.height / 2) * this.level;
      }
    this.draw();
  }
}

let player1;

let player2;

///////////////////////////////////////////////////

function Ball(x, y, dx, dy, radius, color) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.color = color;

  this.draw = () => {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, pi * 2, false);
    c.fillStyle = this.color;
    c.fill();

  }
  if (this.dx < 3 && this.dx > 0) {
    this.dx = 4;
  }
  if (this.dx > -3 && this.dx < 0) {
    this.dx = -4;
  }
  if (this.dy < 3 && this.dy > 0) {
    this.dy = 4;
  }
  if (this.dy > -3 && this.dy < 0) {
    this.dy = -4;
  }
  if (j >= 1) {
    if (this.dx < 0) {
      this.dx -= increment + j / 10;
    } else {
      this.dx += increment + j / 10;
    }
  }
  this.update = () => {
    //Ball Bounds Defined
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy
    }
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
      if (this.x < canvas.width / 2) {
        i++;
          
          this.radius=0;
        setTimeout(() => init(), 1000);
      } else {
        j++;
         this.radius=0;
        setTimeout(() => init(), 1000);
      }
    }

    //incrementing velocity
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }


}

let ball;
////////////////////////////////////////////////////////////

function init() {
  text();
  player1 = undefined;
  player2 = undefined;
  ball = undefined;
  orb.dx = random();
  orb.dy = random();
  player1 = new Paddle(user1.x, user1.y, user1.z, user1.width, user1.height, user1.color, user1.level);

  player2 = new Paddle(user2.x, user2.y, user2.z, user2.width, user2.height, user2.color, user2.level);

  ball = new Ball(orb.x, orb.y, orb.dx, orb.dy, orb.radius, orb.color);

}

function Divider() {
  this.x = canvas.width * (1 / 2 - 1 / 80);
  this.y = 0;

  this.draw = () => {
    c.fillStyle = 'white';
    for (this.y = canvas.height / 10; this.y <= canvas.height; this.y += canvas.height / 5) {
      c.fillRect(this.x, this.y, canvas.width / 40, canvas.height / 10);
    }
  }
}

const divider = new Divider;
//////////////////////////////////////////////////////////
function collision(p, b) {
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;
  //////////////////////////
  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;
  ///////////////////////////////////
  if (p.right >= b.left && p.bottom > b.top && b.right >= p.left && b.bottom > p.top) {
    b.dx = -b.dx; {
      if (b.x < canvas.width / 2) {
        b.dx += increment;
      } else {
        b.dx -= increment;
      }
    }
  }
}

///////////////////////////////////////////////////

function text(i = 0, j = 0) {

  c.font = "10rem Arial";
  c.fillStyle = 'white';
  c.fillText(j, canvas.width * (1 / 2 - 1 / 5), canvas.height / 8);
  c.fillText(i, canvas.width * (1 / 2 + 1 / 8), canvas.height / 8);
  //console.log('text');
}

/////////////////////////////////////////////////
function animate() {
  requestAnimationFrame(animate);
  let player = undefined;
  c.clearRect(0, 0, canvas.width, canvas.height)
  divider.draw();
  player1.update();
  player2.update();
  ball.update();
  text(i, j);
  //To detect which paddle the ball is hitting
  if (ball.x < canvas.width / 2) {
    player = player1;
  } else {
    player = player2;
  }
  collision(player, ball);
}
init();
animate();
