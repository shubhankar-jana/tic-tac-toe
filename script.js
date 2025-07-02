const cells = document.querySelectorAll('[data-cell]');
const turnIndicator = document.getElementById('turnIndicator');
const resetBtn = document.getElementById('resetBtn');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const scoreTies = document.getElementById('scoreTies');
const sounds = {
  move: document.getElementById('moveSound'),
  win: document.getElementById('winSound'),
  tie: document.getElementById('tieSound'),
};

let board = Array(9).fill('');
let currentPlayer = 'X';
let scores = { X:0, O:0, T:0 };

const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetBtn.addEventListener('click', initGame);

initGame();

function handleClick(e) {
  const idx = e.target.dataset.cell;
  if (board[idx] !== '') return;
  board[idx] = currentPlayer;
  e.target.textContent = currentPlayer;
  sounds.move.play();
  if (checkWin(currentPlayer)) {
    turnIndicator.textContent = `Player ${currentPlayer} wins!`;
    scores[currentPlayer]++;
    updateScores();
    sounds.win.play();
    endGame();
  } else if (board.every(c => c)) {
    turnIndicator.textContent = `It's a tie!`;
    scores.T++;
    updateScores();
    sounds.tie.play();
    endGame();
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    turnIndicator.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWin(player) {
  return winningCombos.some(combo =>
    combo.every(i => board[i] === player)
  );
}

function endGame() {
  cells.forEach(cell => cell.removeEventListener('click', handleClick));
}

function initGame() {
  board.fill('');
  cells.forEach(cell => cell.textContent = '');
  currentPlayer = 'X';
  turnIndicator.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(cell => cell.addEventListener('click', handleClick));
}

function updateScores() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreTies.textContent = scores.T;
}
