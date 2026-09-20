const canvas = document.getElementById("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext("2d");

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

window.addEventListener("click", (e) => {
  bodies.push(new Body(e.clientX, e.clientY, 0, 0, "yellow", 10000, 10))
})

let t0 = 0
let accumilator = 0
let targetDt = 1 / 90

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
    bodies.forEach(body => {
      body.update(targetDt)
    })
    accumilator -= targetDt
  }
  bodies.forEach(body => {
    body.draw()
  })
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      attract(bodies[i], bodies[j])
    }
  }
}
animate()