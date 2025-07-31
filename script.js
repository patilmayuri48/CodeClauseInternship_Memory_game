let userName = '', userAge = '';
let category = 'fruits';
let symbols = [];
let matched = 0;
let firstCard = null, secondCard = null;
let lock = false;
let timeLeft = 60; // 1 minute
let interval;

// Show specific screen by ID
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');

  if (id === 'countdown') startCountdown();
  if (id === 'game') startGame();
  if (id === 'dashboard') showDashboard();
}

// Countdown screen: 3 → 2 → 1 → Game
function startCountdown() {
  let count = 3;
  const countNum = document.getElementById('countNum');
  const countdownInterval = setInterval(() => {
    countNum.textContent = count;
    if (count === 0) {
      clearInterval(countdownInterval);
      showScreen('game');
    }
    count--;
  }, 1000);
}

// Game start setup
function startGame() {
  document.getElementById('playerName').textContent = `Player: ${userName}`;
  symbols = getSymbols();
  createCards([...symbols, ...symbols].sort(() => 0.5 - Math.random()));
  matched = 0;
  timeLeft = 60;
  updateTimer();
  interval = setInterval(updateTimer, 1000);
}

// Category icons
function getSymbols() {
  category = document.getElementById('categoryChoice').value;
  const options = {
    fruits: ['🍎','🍓','🍌','🍇','🍑','🍍','🥝','🍉'],
    flowers: ['🌸','🌹','🌻','🌼','💐','🌷','🌺','🌾'],
    emojis: ['😊','😂','😎','😍','🤩','😜','😡','🥳']
  };
  return options[category];
}

// Create game cards
function createCards(array) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  array.forEach(sym => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = sym;
    card.textContent = '';
    card.onclick = () => flipCard(card);
    grid.appendChild(card);
  });
}

// Flip card logic
function flipCard(card) {
  if (lock || card.classList.contains('flipped')) return;
  card.classList.add('flipped');
  card.textContent = card.dataset.value;

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    checkMatch();
  }
}

// Match check logic
function checkMatch() {
  lock = true;
  const match = firstCard.dataset.value === secondCard.dataset.value;
  if (match) {
    matched++;
    if (matched === 8) return endGame(true); // win
    resetCards();
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard.textContent = '';
      secondCard.textContent = '';
      resetCards();
    }, 1000);
  }
}

function resetCards() {
  [firstCard, secondCard] = [null, null];
  lock = false;
}

// 1-minute countdown timer
function updateTimer() {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${mins}:${secs}`;
  if (timeLeft <= 0) {
    clearInterval(interval);
    endGame(false); // time up = loss
  }
  timeLeft--;
}

// Game end: win/loss
function endGame(win) {
  clearInterval(interval);
  showScreen('result');
  const msg = document.getElementById('resultMsg');
  msg.textContent = win ? "🎉 You Won!" : "❌ You Lost!";
  if (win) launchConfetti();
}

// Final screen summary
function showDashboard() {
  document.getElementById('finalName').textContent = userName;
  document.getElementById('finalAge').textContent = userAge;
  document.getElementById('finalScore').textContent = `${matched}/8`;
  document.getElementById('finalTime').textContent = document.getElementById('timer').textContent;
}

// Capture user input
document.getElementById('userName').addEventListener('input', e => userName = e.target.value);
document.getElementById('userAge').addEventListener('input', e => userAge = e.target.value);

// Confetti (Emoji fireworks)
function launchConfetti() {
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = 200;
  ctx.font = "30px serif";
  let count = 0;
  const confettiInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 30; i++) {
      ctx.fillText("🎆", Math.random() * canvas.width, Math.random() * 200);
    }
    count++;
    if (count > 10) clearInterval(confettiInterval);
  }, 200);
}
