var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
window.addEventListener('resize', function(){
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});

function getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min) ) + min;
}
var randomRange = getRndInteger(100 , 120);

var mouse = {
    x:undefined,
    y:undefined
}
window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});
 var colorArr = [
     '#024469',
     '#F5564E',
     //'#FDF9FE'
 ]
function getDistance(x1, x2 ,y1, y2){
return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
/**
* Rotates coordinate system for velocities
*
* Takes velocities and alters them as if the coordinate system they're on was rotated
*
* @param  Object | velocity | The velocity of an individual particle
* @param  Float  | angle    | The angle of collision between two objects in radians
* @return Object | The altered x and y velocities after the coordinate system has been rotated
*/

function rotate(velocity, angle) {
const rotatedVelocities = {
x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
};

return rotatedVelocities;
}

/**
* Swaps out two colliding particles' x and y velocities after running through
* an elastic collision reaction equation
*
* @param  Object | particle      | A particle object with x and y coordinates, plus velocity
* @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
* @return Null | Does not return a value
*/

function resolveCollision(Circle, otherCircle) {
const xVlctDif = Circle.velocity.x - otherCircle.velocity.x;
const yVlctDif = Circle.velocity.y - otherCircle.velocity.y;
const xDist = otherCircle.x - Circle.x;
const yDist = otherCircle.y - Circle.y;

if (xVlctDif * xDist + yVlctDif * yDist >= 0) {
const angle = -Math.atan2(otherCircle.y - Circle.y, otherCircle.x - Circle.x);

const m1 = Circle.mass;
const m2 = Circle.mass;

const u1 = rotate(Circle.velocity, angle);
const u2 = rotate(otherCircle.velocity, angle);
const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

const vFinal1 = rotate(v1, -angle);
const vFinal2 = rotate(v2, -angle);

Circle.velocity.x = vFinal1.x;
Circle.velocity.y = vFinal1.y;

otherCircle.velocity.x = vFinal2.x;
otherCircle.velocity.y = vFinal2.y;
}
}
function Circle(x, y, radius){
this.x = x;
this.y = y;
this.velocity = {
  x : Math.random() * 3,
  y : Math.random() * 3
}
var color=Math.floor(Math.random() * colorArr.length);
this.color = colorArr[color];
this.opacity = 0;
this.radius = radius;
this.mass = 1;

        this.draw = function(){
            c.beginPath();
  c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  c.save();
  c.globalAlpha = this.opacity;
  c.fillStyle = this.color;
    c.fill();
  c.restore();
  c.strokeStyle = this.color;
  c.stroke();
  c.closePath();
        }
       this.animation = function(Circle){
           if(this.x + this.radius > window.innerWidth || this.x - this.radius < 0){
                this.velocity.x = -this.velocity.x;
           }
           if(this.y + this.radius > window.innerHeight || this.y - this.radius < 0){
                this.velocity.y = -this.velocity.y;
           }
            this.x += this.velocity.x;
            this.y += this.velocity.y;

  for(var j = 0; j < circleArr.length; j++){
    if(this == circleArr[j]) continue;
    if(getDistance(this.x, circleArr[j].x, this.y, circleArr[j].y) - radius * 2 < 0){
      resolveCollision(this, circleArr[j]);
    }
  }
            if(getDistance(mouse.x, this.x, mouse.y, this.y) < 100 && this.opacity < 0.7){
                this.opacity += 0.2;
            }else if(this.opacity > 0){
    this.opacity -= 0.2;

    this.opacity = Math.max(0, this.opacity);
  }
            /*else if(this.radius > this.minRadius){
                this.radius -= 1;
            }*/
            this.draw();
       }
   }

var circleArr = [];;

function init(){


for(let i = 0; i < randomRange; i++){
  let x = Math.random() * (window.innerWidth - radius * 2) + radius;
  let y = Math.random() * (window.innerHeight - radius * 2) + radius;
  const vx = Math.random() * 3;
  const vy = Math.random() * 3;
  var radius = 15;
  if(i != 0){
    for(var j = 0; j < circleArr.length; j++){
      if(getDistance(x, circleArr[j].x, y, circleArr[j].y) - radius * 2 < 0){
        x = Math.random() * (window.innerWidth - radius * 2) + radius;
        y = Math.random() * (window.innerHeight - radius * 2) + radius;

        j = -1;
      }
    }
  }

  circleArr.push(new Circle(x, y, radius));
}
}
   function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    for(var i = 0; i < circleArr.length; i++){
circleArr[i].animation();
}


    }

    init();
    animate();
