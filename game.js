const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let attempts = 5;
let gameOver = false;

// Game elements
const goal = { x: 150, y: 50, width: 300, height: 120 };
const keeper = { x: 270, y: 110, width: 60, height: 60, targetX: 270 };
const ball = { x: 300, y: 340, radius: 14, startX: 300, startY: 340, targetX: 300, targetY: 340, moving: false };

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Pitch Grass Lines
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // Goal Post
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 6;
  ctx.strokeRect(goal.x, goal.y, goal.width, goal.height);

  // Goalkeeper
  ctx.fillStyle = "#ff5722";
  ctx.fillRect(keeper.x, keeper.y, keeper.width, keeper.height);

  // Ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function update() {
  if (ball.moving) {
    ball.x += (ball.targetX - ball.x) * 0.1;
    ball.y += (ball.targetY - ball.y) * 0.1;

    // Move Goalkeeper towards shot direction with AI variation
    keeper.x += (keeper.targetX - keeper.x) * 0.08;

    // Check collision / goal state
    if (Math.abs(ball.y - ball.targetY) < 2) {
      ball.moving = false;
      checkGoal();
    }
  }
  draw();
  requestAnimationFrame(update);
}

canvas.addEventListener('click', (e) => {
  if (gameOver || ball.moving || attempts <= 0) return;

  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // Aim towards click location inside goal area
  ball.targetX = clickX;
  ball.targetY = clickY;
  ball.moving = true;

  // Keeper chooses a random defensive direction
  const choices = [goal.x + 10, goal.x + goal.width / 2 - 30, goal.x + goal.width - 70];
  keeper.targetX = choices[Math.floor(Math.random() * choices.length)];
});

function checkGoal() {
  attempts--;
  document.getElementById('attempts').innerText = attempts;

  const hitKeeper = (
    ball.x >= keeper.x &&
    ball.x <= keeper.x + keeper.width &&
    ball.y >= keeper.y &&
    ball.y <= keeper.y + keeper.height
  );

  const insideGoal = (
    ball.x >= goal.x &&
    ball.x <= goal.x + goal.width &&
    ball.y >= goal.y &&
    ball.y <= goal.y + goal.height
  );

  if (insideGoal && !hitKeeper) {
    score++;
    document.getElementById('score').innerText = score;
  }

  setTimeout(() => {
    if (attempts > 0) {
      resetBall();
    } else {
      gameOver = true;
      document.getElementById('resetBtn').style.display = 'inline-block';
    }
  }, 1000);
}

function resetBall() {
  ball.x = ball.startX;
  ball.y = ball.startY;
  keeper.x = 270;
  keeper.targetX = 270;
}

function resetGame() {
  score = 0;
  attempts = 5;
  gameOver = false;
  document.getElementById('score').innerText = score;
  document.getElementById('attempts').innerText = attempts;
  document.getElementById('resetBtn').style.display = 'none';
  resetBall();
}

update();
