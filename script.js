let stars = document.getElementById('stars');
let meteorid = document.getElementById('meteorid');
let rocket = document.getElementById('rocket');
let text = document.getElementById('text');
let button = document.getElementById('button');

const timeline = document.querySelector('.timeline');
const root = document.documentElement;

// === Update progress garis timeline ===
function updateLineProgress() {
  if (!timeline) return;

  const viewportBottom = window.scrollY + window.innerHeight;
  const start = timeline.offsetTop;
  const end = start + timeline.offsetHeight + window.innerHeight;

  let p = (viewportBottom - start) / (end - start);
  p = Math.max(0, Math.min(1, p));

  root.style.setProperty('--line-progress', p);
}

// === Animasi Parallax ===
function parallaxScroll() {
  let value = window.scrollY;
  stars && (stars.style.left = value * 0.25 + 'px');
  rocket && (rocket.style.transform = `translate(-50%, calc(-50% + ${value * -1.15}px))`);
  text && (text.style.transform = `translate(-50%, calc(-50% - ${value * 0.77}px))`);
}

// === Trigger Timeline Kotak ===
function triggerTimeline() {
  const triggerBottom = window.innerHeight * 0.65;
  document.querySelectorAll('.timeline .kotak').forEach(el => {
    const rect = el.getBoundingClientRect();
    el.classList.toggle('show', rect.top < triggerBottom && rect.bottom > 0);
  });
}

// === Trigger Grid Box ===
function triggerGrid() {
  const triggerBottom = window.innerHeight * 0.721241243;
  document.querySelectorAll('.grid-box').forEach(el => {
    const rect = el.getBoundingClientRect();
    el.classList.toggle('show', rect.top < triggerBottom && rect.bottom > 0);
  });
}

// === Trigger Separator ===
function triggerSeparator() {
  const triggerBottom = window.innerHeight * 0.884955751;
  document.querySelectorAll('.separator').forEach(el => {
    const rect = el.getBoundingClientRect();
    el.classList.toggle('show', rect.top < triggerBottom && rect.bottom > 0);
  });
}

// === Timeline Line  ===
function checkTimeline() {
  if (!timeline) return;
  const rect = timeline.getBoundingClientRect();
  const triggerBottom = window.innerHeight * 0.77;
  timeline.classList.toggle('active', rect.top < triggerBottom && rect.bottom > 0);
}

// === Master Scroll Handler ===
function onScroll() {
  parallaxScroll();
  triggerTimeline();
  triggerTitle();
  triggerGrid();
  triggerSeparator();
  updateLineProgress();
  checkTimeline();
}

window.addEventListener('scroll', onScroll);
window.addEventListener('load', onScroll);
window.addEventListener('resize', onScroll);

// === Explore button scroll ===
button.addEventListener('click', function (e) {
  e.preventDefault();
  document.getElementById('desc').scrollIntoView({ behavior: 'smooth' });
});

// === Trigger Section Title ===
function triggerTitle() {
  const triggerBottom = window.innerHeight * 0.7;
  document.querySelectorAll('.section-title').forEach(el => {
    const rect = el.getBoundingClientRect();
    el.classList.toggle('show', rect.top < triggerBottom && rect.bottom > 0);
  });
}

// ===== FIREWORKS =====
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const paralax = document.querySelector('.paralax');

class Particle {
  constructor(x, y, color, velocity) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
    this.gravity = 0.05;
  }
  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.y += this.gravity;
    this.alpha -= 0.01;
  }
  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

let particles = [];

function createFirework(x, y) {
  const colors = ['#ff0044', '#00ff99', '#ffff00', '#ff7700', '#ffffff'];
  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * 5 + 2;
    particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)], {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    }));
  }
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.alpha <= 0) particles.splice(i, 1);
  });

  requestAnimationFrame(animate);
}

animate();

function randomFirework() {
  const rect = paralax.getBoundingClientRect();
  createFirework(rect.left + Math.random() * rect.width, rect.top + Math.random() * rect.height);
}

setInterval(randomFirework, 500);

canvas.addEventListener('click', (e) => {
  const rect = paralax.getBoundingClientRect();
  if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
    createFirework(e.clientX, e.clientY);
  }
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// ===== MUSIC =====
const audio = document.getElementById('bg-music');
const musicButton = document.getElementById('music-button');

musicButton.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().then(() => musicButton.innerText = "Pause Music").catch(err => console.log(err));
  } else {
    audio.pause();
    musicButton.innerText = "About You";
  }
});
audio.play().catch(err => console.log(err));



// ===== FORM INPUT UNTUK 9 KOTAK =====
document.querySelectorAll(".grid-form").forEach(form => {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const title = form.querySelector(".grid-title").value;
    const desc = form.querySelector(".grid-desc").value;
    const img = form.querySelector(".grid-img").files[0];
    if (img) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        const container = document.createElement("div");
        container.classList.add("grid-box", "show"); // tambahkan class show
        container.innerHTML = `
    <div class="box-konten">
        <img src="${ev.target.result}" alt="${title}">
        <div class="teks-judul">${title}</div>
        <div class="teks-naik">${desc}</div>
    </div>
`;
        form.parentElement.replaceWith(container); // replace form-box dengan kotak baru
        ;
      }
      reader.readAsDataURL(img);
    }
  });
});
