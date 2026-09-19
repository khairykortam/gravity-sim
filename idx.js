const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width,canvas.height);


let history = [];
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(other) {
    return new Vector(this.x + other.x, this.y + other.y);
  }
  sub(other) {
    return new Vector(this.x - other.x, this.y - other.y);
  }
  mult(other) {
    return new Vector(this.x * other.x, this.y * other.y);
  }
  div(other) {
    return new Vector(this.x / other.x, this.y / other.y);
  }
  mag(){
    return Math.sqrt(this.x*this.x+this.y*this.y);
  }
  stringify(){
    return this.x + "," + this.y + ",";
  }
}

class Body {
    constructor(x, y,radius,vx,vy,ax,ay,color){
        this.pos = {x: x, y:y};
        this.pos0 = { x: x, y: y };
        this.vel = {x:vx, y:vy};
        this.radius = radius;
        this.color = color;
    }
  applyforce(){

  }
}


function drawObject(object) {
  let xpos = object.position.x;
  let ypos = object.position.y;
  let colour = object.color;
  let rad = object.radius;
  ctx.beginPath();
  ctx.arc(xpos, ypos, rad, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = colour;
  ctx.fill();
}
let O1 = new Planet(
  new Vector(400, 400),
  new Vector(0, 0),
  400,
  400,
  "red",
  "MARCH",
);
drawObject(O1);