const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext("2d");

let t_init = 0;
let magic_const = 1000;
let accu = 0;
let FPS = 1 / 90;
const g = 9.81*magic_const;
let balls = [];
class Ball {
  constructor(x, y, vx, vy, color, mass, radius) {
    this.pos = { x: x, y: y };
    this.pos0 = { x: x - vx, y: y - vy };
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.mass = mass;
    this.radius = radius
    this.color = color;
  }
  applyforce(x, y) {
    this.acc.x += x / this.mass;
    this.acc.y += y / this.mass;
  }
  drawCircle(){
    c.beginPath();
    c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill()
  }
  verlet(dt){
    this.vel.x = this.pos.x - this.pos0.x;
    this.vel.y = this.pos.y - this.pos0.y;
    this.pos0.x = this.pos.x 
    this.pos0.y = this.pos.y
    this.acc.y += g;
    this.pos.x += this.vel.x + this.acc.x * dt * dt
    this.pos.y += this.vel.y + this.acc.y * dt * dt 
    this.acc = {x:0,y:0};
  }
   collide(b2){
    let position = {dx: this.pos.x-b2.pos.x, dy: this.pos.y - b2.pos.y};
    let dist = Math.sqrt(position.dx*position.dx + position.dy * position.dy);

    if (dist < (this.radius+b2.radius) && dist > 0){
        const overlap = this.radius + b2.radius - dist;
        let normx = position.dx / dist;
        let normy = position.dy / dist;
        const Mass_total = this.mass + b2.mass;

        this.pos.x += normx * overlap * (b2.mass / Mass_total);
        this.pos.y += normy * overlap * (b2.mass / Mass_total);
        b2.pos.x -= normx * overlap * (this.mass / Mass_total);
        b2.pos.y -= normy * overlap * (this.mass / Mass_total);
    }
   }
    constrain_motion(){
        const r = this.radius
        let damp = 0.8;
        let vx = this.pos.x - this.pos0.x;
        let vy = this.pos.y - this.pos0.y;

        if(this.pos.y > canvas.height - r){
            this.pos.y = canvas.height - r;
            this.pos0.y = this.pos.y + vy * damp; 
        }
        else if(this.pos.y < r){
            this.pos.y = r;
            this.pos0.y = this.pos.y + vy * damp; 
        }
        if(this.pos.x > canvas.width - r){
            this.pos.x = canvas.width - r;
            this.pos0.x = this.pos.x + vx * damp; 
        }
        else if(this.pos.x < r){
            this.pos.x = r;
            this.pos0.x = this.pos.x + vx * damp; 
        }
    }

  attract(object) {
  let g_earth = 6700;
  let position = {dx: object.pos.x - this.pos.x, dy: object.pos.y - this.pos.y};
  let dist = Math.hypot(position.dx, position.dy);

  if(dist > 0 && dist < 150){
    let force = g_earth * this.mass * object.mass / (dist*dist);
    const fdx = force * position.dx / dist;
    let fdy = force * position.dy / dist;
    this.applyforce(fdx,fdy);
    object.applyforce(-fdx, -fdy);
  }
}
}





window.addEventListener("click", (event)=> {
    balls.push(new Ball(event.clientX, event.clientY, 0, 0, "yellow", 10,10));
});




function animate(t){
    let dt =(t-t_init) / magic_const;
    if(isNaN(dt) || dt > 0.1){
        dt = 0;
    }
    accu +=dt ;
    t_init = t ;
    c.clearRect(0,0,canvas.width, canvas.height);
    
    while(accu > FPS){
        for(let i=0;i<balls.length;i++)
            for (let j= i+1;j<balls.length;j++)
                balls[i].attract(balls[j]);

        balls.forEach(element => {
            element.verlet(FPS);
        });
        for(let i=0;i<balls.length;i++)
            for (let j= i+1;j<balls.length;j++)
                balls[i].collide(balls[j]);

        balls.forEach(element => {
            element.constrain_motion();
        });
        accu -= FPS;
}
balls.forEach(element => {
    element.drawCircle();
});
requestAnimationFrame(animate);
}
requestAnimationFrame(animate);