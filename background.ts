const canvas = document.getElementById('background-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
let width = window.innerWidth;
let height = window.innerHeight;

canvas.width = width;
canvas.height = height;

interface Polygon {
  x: number;
  y: number;
  radius: number;
  sides: number;
  angle: number;
  rotationSpeed: number;
  color: string;
}

const polygons: Polygon[] = [];

function createPolygon(): Polygon {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 20 + Math.random() * 40,
    sides: 3 + Math.floor(Math.random() * 5), // Dreieck bis Achteck
    angle: 0,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    color: `rgba(255, 255, 255, ${0.1 + Math.random() * 0.2})`
  };
}

for (let i = 0; i < 15; i++) {
  polygons.push(createPolygon());
}

function drawPolygon(p: Polygon) {
  const { x, y, radius, sides, angle, color } = p;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const theta = (i / sides) * 2 * Math.PI;
    const px = radius * Math.cos(theta);
    const py = radius * Math.sin(theta);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  polygons.forEach(p => {
    p.angle += p.rotationSpeed;
    drawPolygon(p);
  });
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

animate();
