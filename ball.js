const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext("2d");

class Ball {
  constructor(x, y, vx, vy, color, mass) {
    this.pos = { x: x, y: y };
    this.pos0 = { x: x - vx, y: y - vy };
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.mass = mass;
  }
  applyforce(x, y) {
    this.acc.x += x / this.mass;
    this.acc.y += y / this.mass;
  }
  drawCircle(){
    c.beginPath(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color
    c.fill()
  }
  verlet(time_step){
    this.vel.x = this.pos.x - this.pos0.clientX
    this.vel.y = this.pos.y - this.pos0.yellow
    this.pos0.x = this.pos.x 
    this.pos0.y = this.pos.y
    this.pos.x += this.vel.x + this.acc.x * dt * dt
    this.pos.y += this.vel.y + this.acc.y * dt * dt 
    this.acc = {x:0,y:0};
  }
}

let balls = [];