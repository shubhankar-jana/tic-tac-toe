const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const winnerText = document.getElementById("winner");
const resetBtn = document.getElementById("resetBtn");
const undoBtn = document.getElementById("undoBtn");
const modeBtn = document.getElementById("modeBtn");
const rulesBtn = document.getElementById("rulesBtn");
const modal = document.getElementById("rulesModal");
const closeModal = document.getElementById("closeModal");
const difficultySelect = document.getElementById("difficulty");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;
let moveHistory = [];
let darkMode = true;
let scores = { X: 0, O: 0 };

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// === Game Initialization ===
function initGame() {
  cells.forEach((cell, i) => {
    cell.textContent = "";
    cell.style.background = "";
    cell.addEventListener("click", () => cellClick(i));
  });
  updateStatus();
}

// === Handle Cell Click ===
function cellClick(i) {
  if (board[i] || gameOver) return;

  board[i] = currentPlayer;
  moveHistory.push(i);
  cells[i].textContent = currentPlayer;
  cells[i].style.color = currentPlayer === "X" ? "var(--accent-x)" : "var(--accent-o)";
  checkWinner();
  if (!gameOver) switchPlayer();
}

// === Switch Player ===
function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();
}

// === Update Status Text ===
function updateStatus() {
  statusText.textContent = `Player ${currentPlayer} Turn`;
  statusText.style.color =
    currentPlayer === "X" ? "var(--accent-x)" : "var(--accent-o)";
}

// === Check for Winner ===
function checkWinner() {
  for (const [a, b, c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      highlightWinner([a, b, c]);
      gameOver = true;
      winnerText.textContent = `🎉 Player ${board[a]} Wins!`;
      scores[board[a]]++;
      updateScoreboard();
      return;
    }
  }

  if (!board.includes("")) {
    winnerText.textContent = "🤝 It's a Draw!";
    gameOver = true;
  }
}

// === Highlight Winning Cells ===
function highlightWinner(indices) {
  indices.forEach(i => {
    cells[i].style.background = "linear-gradient(145deg, #00f6ff, #ff00c3)";
    cells[i].style.boxShadow = "0 0 25px #00f6ff";
  });
}

// === Undo Last Move ===
undoBtn.addEventListener("click", () => {
  if (moveHistory.length === 0 || gameOver) return;
  const lastMove = moveHistory.pop();
  board[lastMove] = "";
  cells[lastMove].textContent = "";
  cells[lastMove].style.background = "";
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  gameOver = false;
  winnerText.textContent = "";
  updateStatus();
});

// === Reset Game ===
resetBtn.addEventListener("click", () => {
  board = ["", "", "", "", "", "", "", "", ""];
  moveHistory = [];
  gameOver = false;
  currentPlayer = "X";
  winnerText.textContent = "";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.style.background = "";
    cell.style.boxShadow = "";
  });
  updateStatus();
});

// === Mode Toggle (Light/Dark) ===
modeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  darkMode = !darkMode;
  modeBtn.textContent = darkMode ? "🌙 Dark" : "☀️ Light";
});

// === Rules Modal ===
rulesBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// === Scoreboard Update ===
function updateScoreboard() {
  scoreX.textContent = `Player X: ${scores.X}`;
  scoreO.textContent = `Player O: ${scores.O}`;
}

// === Difficulty (optional AI feature) ===
difficultySelect.addEventListener("change", (e) => {
  const level = e.target.value;
  console.log(`Difficulty set to: ${level}`);
  // Placeholder: implement AI later for easy/medium/hard
});

// === Start the Game ===
initGame();

