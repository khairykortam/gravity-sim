const canvas = document.getElementById("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext("2d");

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  const c = canvas.getContext("2d");
})

var pos0 = {x: undefined, y: undefined}
var pos0 = {x: undefined, y: undefined}
var dragging = false

class Body {
    constructor(x, y, vx, vy, color, mass, density){
        this.pos = {x: x, y: y};
        this.pos0 = {x: x - vx, y: y - vy};
        this.vel = {x: 0, y: 0};
        this.acc = {x: 0, y: 0}
        this.color = color;
        this.mass = mass
        this.density = density
        let volume = this.mass / this.density
        this.radius = Math.cbrt(3 / (4 * Math.PI) * volume);
        this.dragging = false
    }
  applyforce(x, y) {
    this.acc.x += x / this.mass
    this.acc.y += y / this.mass
  }
  draw() {
    c.beginPath()
    c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }
  update(dt) {
    if (dragging) {
      return
    }
    this.vel.x = this.pos.x - this.pos0.x
    this.vel.y = this.pos.y - this.pos0.y
    this.pos0.x = this.pos.x
    this.pos0.y = this.pos.y
    this.pos.x += this.vel.x + this.acc.x * dt * dt
    this.pos.y += this.vel.y + this.acc.y * dt * dt
    this.acc = {x: 0, y: 0}
  }
}

let bodies = []

function collide(b1, b2){
  let vect = {x: b2.pos.x - b1.pos.x, y: b2.pos.y - b1.pos.y}
  let dist = Math.hypot(vect.x, vect.y);
  if(dist <= b1.radius + b2.radius){
    var norm = {x: vect.x / dist, y: vect.y / dist}
    var x = b1.radius + b2.radius - dist
    var mass_sum = b1.mass + b2.mass
    b1.pos.x -= norm.x * x * (b2.mass / mass_sum)
    b1.pos.y -= norm.y * x * (b2.mass / mass_sum)
    b2.pos.x += norm.x * x * (b1.mass / mass_sum)
    b2.pos.y += norm.y * x * (b1.mass / mass_sum)
    var rel = {x: b2.vel.x - b1.vel.x, y: b2.vel.y - b1.vel.y}
    var vel = rel.x * norm.x + rel.y * norm.y
    var elasticity = 0.5
    var impulse = -(1 + elasticity) * vel / (1 / b1.mass + 1 / b2.mass)
    b1.vel.x -= impulse * norm.x / b1.mass
    b1.vel.y -= impulse * norm.y / b1.mass
    b2.vel.x += impulse * norm.x / b2.mass
    b2.vel.y += impulse * norm.y / b2.mass
    b1.pos0.x = b1.pos.x - b1.vel.x
    b1.pos0.y = b1.pos.y - b1.vel.y
    b2.pos0.x = b2.pos.x - b2.vel.x
    b2.pos0.y = b2.pos.y - b2.vel.y
  }
}

function attract(b1, b2) {
  var vect = {x: b2.pos.x - b1.pos.x, y: b2.pos.y - b1.pos.y}
  var dist = Math.hypot(vect.x, vect.y)
  if (dist !== 0) {
    var norm = {x: vect.x / dist, y: vect.y / dist}
    var force = 10 * (b1.mass * b2.mass) / (dist * dist)
    b1.applyforce(norm.x * force, norm.y * force)
    b2.applyforce(-norm.x * force, -norm.y * force)
  }
}

canvas.addEventListener("mousedown", (e) => {
  if (e.button == 2) {
    dragging = true
  }
  pos0 = {x: e.clientX, y: e.clientY}
  bodies.push(new Body(pos0.x, pos0.y, 0, 0, document.querySelector("#color").value, parseInt(document.querySelector("#mass").value), parseInt(document.querySelector("#density").value)))
  bodies.at(-1).dragging = true
})

window.addEventListener("mouseup", (e) => {
  pos = {x: e.clientX, y: e.clientY}
  if (dragging) {
    dragging = false
  }
  else {
    bodies.at(-1).pos0.x += (pos.x - pos0.x) / 100
    bodies.at(-1).pos0.y += (pos.y - pos0.y) / 100
    bodies.at(-1)
  }
  
})

let t0 = 0
let accumilator = 0
let targetDt = 1 / 180

function animate(t) {
  let dt = (t - t0) / 1000
  
  if (isNaN(dt) || dt > 0.1) {
    dt = 0
  }
  accumilator += dt
  t0 = t
  
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)
  
  while (accumilator > targetDt) {
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        attract(bodies[i], bodies[j])
      }
    }
    bodies.forEach(body => {
      body.update(targetDt)
    })
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        collide(bodies[i], bodies[j])
      }
    }
    accumilator -= targetDt
  }
  bodies.forEach(body => {
    body.draw()
  })
  
}
animate();