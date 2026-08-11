{`const particles = document.querySelector(".particles");
const spellName = document.getElementById("spellName");
const orb = document.querySelector(".orb");

function castSpell(type) {

  const names = {
    lumos: "LUMOS",
    fire: "INCENDIO",
    leviosa: "WINGARDIUM LEVIOSA",
    patronus: "EXPECTO PATRONUM"
  };

  spellName.textContent = names[type];

  setTimeout(() => {
    spellName.textContent = "";
  }, 1800);

  let colors = {
    lumos: ["#fff", "#ffd86b"],
    fire: ["#fff", "#ff6a00", "#ff0000"],
    leviosa: ["#fff", "#d26cff", "#7b3cff"],
    patronus: ["#fff", "#66ccff", "#256dff"]
  };

  const chosen = colors[type];

  for (let i = 0; i < 120; i++) {

    const p = document.createElement("div");

    p.className = "particle";

    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 350;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    p.style.left = "50%";
    p.style.top = "50%";

    p.style.setProperty("--x", x + "px");
    p.style.setProperty("--y", y + "px");

    p.style.background =
      chosen[Math.floor(Math.random() * chosen.length)];

 const video = document.querySelector(".input-video");
const canvas = document.querySelector(".output-canvas");
const ctx = canvas.getContext("2d");

const loading = document.getElementById("loading");
const modeText = document.getElementById("mode");
const handsText = document.getElementById("hands");

let currentMode = "rainbow";

let particles = [];

function setMode(mode) {

  currentMode = mode;

  modeText.textContent =
    "MODE: " + mode.toUpperCase();

}


// Resize canvas
function resizeCanvas() {

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// Create particle
function createParticle(x, y) {

  let colors = {

    rainbow: ["#ff0055", "#00ffff", "#ffff00", "#8a2be2"],

    cyber: ["#00ffff", "#ff00ff", "#00ff88"],

    fire: ["#ff0000", "#ff6600", "#ffff00"],

    ocean: ["#00ffff", "#0088ff", "#66ccff"],

    galaxy: ["#ffffff", "#aa66ff", "#ff66ff"]

  };

  const palette = colors[currentMode];

  particles.push({

    x: x,

    y: y,

    vx: (Math.random() - 0.5) * 2,

    vy: (Math.random() - 0.5) * 2,

    size: Math.random() * 5 + 2,

    life: 1,

    color:
      palette[Math.floor(Math.random() * palette.length)]

  });

}


// Draw particles
function drawParticles() {

  for (let i = particles.length - 1; i >= 0; i--) {

    const p = particles[i];

    p.x += p.vx;

    p.y += p.vy;

    p.life -= 0.018;

    ctx.globalAlpha = p.life;

    ctx.fillStyle = p.color;

    ctx.shadowBlur = 20;

    ctx.shadowColor = p.color;

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      p.size,
      0,
      Math.PI * 2
    );

    ctx.fill();

    if (p.life <= 0) {

      particles.splice(i, 1);

    }

  }

  ctx.globalAlpha = 1;

}


// Convert MediaPipe coordinates
function pointToCanvas(point) {

  return {

    x: (1 - point.x) * canvas.width,

    y: point.y * canvas.height

  };

}


// Draw glowing line
function drawGlowLine(a, b, color) {

  ctx.save();

  ctx.strokeStyle = color;

  ctx.lineWidth = 5;

  ctx.shadowBlur = 25;

  ctx.shadowColor = color;

  ctx.beginPath();

  ctx.moveTo(a.x, a.y);

  ctx.lineTo(b.x, b.y);

  ctx.stroke();

  ctx.restore();

}


// Finger connections
const connections = [

  [0,1],
  [1,2],
  [2,3],
  [3,4],

  [0,5],
  [5,6],
  [6,7],
  [7,8],

  [0,9],
  [9,10],
  [10,11],
  [11,12],

  [0,13],
  [13,14],
  [14,15],
  [15,16],

  [0,17],
  [17,18],
  [18,19],
  [19,20]

];


// Rainbow color
function rainbowColor(index) {

  return `hsl(${(Date.now() / 5 + index * 25) % 360},100%,65%)`;

}


// Handle detected hands
function onResults(results) {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  const detectedHands =
    results.multiHandLandmarks || [];

  handsText.textContent =
    "HANDS: " + detectedHands.length;


  detectedHands.forEach((landmarks, handIndex) => {

    const points = landmarks.map(pointToCanvas);


    // Draw connections
    connections.forEach((connection, index) => {

      const a =
        points[connection[0]];

      const b =
        points[connection[1]];

      let color;

      if (currentMode === "rainbow") {

        color = rainbowColor(index);

      }

      else if (currentMode === "cyber") {

        color =
          index % 2 === 0
            ? "#00ffff"
            : "#ff00ff";

      }

      else if (currentMode === "fire") {

        color =
          index % 2 === 0
            ? "#ff3300"
            : "#ffaa00";

      }

      else if (currentMode === "ocean") {

        color =
          index % 2 === 0
            ? "#00ffff"
            : "#0088ff";

      }

      else {

        color =
          index % 2 === 0
            ? "#ffffff"
            : "#bb66ff";

      }

      drawGlowLine(a, b, color);

    });


    // Draw fingertips
    const fingertips = [4, 8, 12, 16, 20];

    fingertips.forEach(index => {

      const p = points[index];

      ctx.beginPath();

      ctx.fillStyle =
        currentMode === "fire"
          ? "#ff6600"
          : "#ffffff";

      ctx.shadowBlur = 30;

      ctx.shadowColor = "#00ffff";

      ctx.arc(
        p.x,
        p.y,
        8,
        0,
        Math.PI * 2
      );

      ctx.fill();


      // Add particles
      for (let i = 0; i < 2; i++) {

        createParticle(p.x, p.y);

      }

    });


    // Special energy between palms
    if (detectedHands.length >= 2) {

      const palm1 = points[9];

      const palm2 =
        pointToCanvas(
          detectedHands[
            (handIndex + 1) % detectedHands.length
          ][9]
        );

      const gradient =
        ctx.createLinearGradient(
          palm1.x,
          palm1.y,
          palm2.x,
          palm2.y
        );

      gradient.addColorStop(
        0,
        "#00ffff"
      );

      gradient.addColorStop(
        0.5,
        "#ff00ff"
      );

      gradient.addColorStop(
        1,
        "#ffff00"
      );

      ctx.strokeStyle = gradient;

      ctx.lineWidth = 12;

      ctx.shadowBlur = 40;

      ctx.shadowColor = "#ff00ff";

      ctx.beginPath();

      ctx.moveTo(
        palm1.x,
        palm1.y
      );

      ctx.lineTo(
        palm2.x,
        palm2.y
      );

      ctx.stroke();

    }

  });


  drawParticles();

  loading.style.display = "none";

}


// MediaPipe Hands
const hands = new Hands({

  locateFile: (file) => {

    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;

  }

});


hands.setOptions({

  maxNumHands: 2,

  modelComplexity: 1,

  minDetectionConfidence: 0.6,

  minTrackingConfidence: 0.6

});


hands.onResults(onResults);


// Camera
const camera = new Camera(
  video,
  {

    onFrame: async () => {

      await hands.send({
        image: video
      });

    },

    width: 1280,

    height: 720

  }
);


camera.start();