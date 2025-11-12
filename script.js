const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const winnerText = document.getElementById('winner');
const resetBtn = document.getElementById('resetBtn');
const undoBtn = document.getElementById('undoBtn');
const difficultySelect = document.getElementById('difficulty');
const modeBtn = document.getElementById('modeBtn');
const rulesBtn = document.getElementById('rulesBtn');
const rulesModal = document.getElementById('rulesModal');
const closeModal = document.getElementById('closeModal');

// 🔊 Sounds
const moveSound = document.getElementById("moveSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let currentPlayer = 'X';
let board = Array(9).fill('');
let gameActive = true;
let movesHistory = [];
let scoreX = 0, scoreO = 0;

// 🎮 Win Modal
const winModal = document.createElement('div');
winModal.className = 'modal';
winModal.innerHTML = `
  <div class="modal-content">
    <span id="closeWinModal">&times;</span>
    <h2 id="winMessage">🎉</h2>
    <button id="playAgainBtn">Play Again</button>
  </div>
`;
document.body.appendChild(winModal);
const closeWinModal = winModal.querySelector('#closeWinModal');
const playAgainBtn = winModal.querySelector('#playAgainBtn');
const winMessage = winModal.querySelector('#winMessage');

// 🎨 Theme toggle
modeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  modeBtn.textContent = document.body.classList.contains('light') ? '☀️ Light' : '🌙 Dark';
});

// 📜 Rules modal
rulesBtn.addEventListener('click', () => (rulesModal.style.display = 'flex'));
closeModal.addEventListener('click', () => (rulesModal.style.display = 'none'));

// 🏆 Win modal control
closeWinModal.addEventListener('click', () => (winModal.style.display = 'none'));
playAgainBtn.addEventListener('click', () => {
  winModal.style.display = 'none';
  resetGame();
});

// 🧠 All possible wins
const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// 🕹️ Player click
cells.forEach((cell, index) => {
  cell.addEventListener('click', () => handleCellClick(index));
});

function handleCellClick(index) {
  if (!gameActive || board[index] !== '') return;

  board[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
  cells[index].style.color = currentPlayer === 'X' ? 'var(--accent-x)' : 'var(--accent-o)';
  movesHistory.push(index);

  // 🔊 Play move sound
  moveSound.currentTime = 0;
  moveSound.play();

  if (checkWin()) return endGame(`${currentPlayer} Wins!`);
  if (board.every(cell => cell !== '')) return endGame("It's a Draw!");

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer} Turn`;

  // 🤖 Computer Move
  const mode = difficultySelect.value;
  if (mode !== 'human' && currentPlayer === 'O') {
    statusText.textContent = '🤖 Computer Thinking...';
    gameActive = false;
    setTimeout(() => {
      computerMove(mode);
      gameActive = true;
    }, 800);
  }
}

// 💻 Computer logic
function computerMove(mode) {
  let move;
  if (mode === 'easy') move = getRandomMove();
  else if (mode === 'medium') move = getSmartMove();
  else move = getBestMove(); // hard

  if (move != null) {
    board[move] = 'O';
    cells[move].textContent = 'O';
    cells[move].style.color = 'var(--accent-o)';
    movesHistory.push(move);

    // 🔊 Play move sound
    moveSound.currentTime = 0;
    moveSound.play();

    if (checkWin()) return endGame('Computer Wins!');
    if (board.every(cell => cell !== '')) return endGame("It's a Draw!");

    currentPlayer = 'X';
    statusText.textContent = `Player ${currentPlayer} Turn`;
  }
}

// 🎯 Easy move
function getRandomMove() {
  const empty = board.map((v,i)=>v===''?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

// ⚡ Medium AI
function getSmartMove() {
  for (const pattern of winPatterns) {
    const [a,b,c] = pattern;
    const values = [board[a], board[b], board[c]];
    if (values.filter(v=>v==='O').length===2 && values.includes('')) return pattern[values.indexOf('')];
  }
  for (const pattern of winPatterns) {
    const [a,b,c] = pattern;
    const values = [board[a], board[b], board[c]];
    if (values.filter(v=>v==='X').length===2 && values.includes('')) return pattern[values.indexOf('')];
  }
  return getRandomMove();
}

// 🔥 Hard AI (minimax)
function getBestMove() {
  let bestScore = -Infinity, move;
  for (let i=0;i<9;i++) {
    if (board[i]==='') {
      board[i]='O';
      const score = minimax(board,0,false);
      board[i]='';
      if (score>bestScore){bestScore=score;move=i;}
    }
  }
  return move;
}

function minimax(board,depth,isMaximizing){
  const winner = getWinner();
  if(winner==='O') return 10-depth;
  if(winner==='X') return depth-10;
  if(board.every(c=>c!=='')) return 0;

  if(isMaximizing){
    let best=-Infinity;
    for(let i=0;i<9;i++){
      if(board[i]===''){
        board[i]='O';
        best=Math.max(best,minimax(board,depth+1,false));
        board[i]='';
      }
    }
    return best;
  } else {
    let best=Infinity;
    for(let i=0;i<9;i++){
      if(board[i]===''){
        board[i]='X';
        best=Math.min(best,minimax(board,depth+1,true));
        board[i]='';
      }
    }
    return best;
  }
}

// 🏁 Check win
function checkWin() {
  return winPatterns.some(([a,b,c]) => board[a] && board[a]===board[b] && board[a]===board[c]);
}

function getWinner(){
  for(const [a,b,c] of winPatterns){
    if(board[a] && board[a]===board[b] && board[a]===board[c]) return board[a];
  }
  return null;
}

// 🎉 End Game
function endGame(message) {
  gameActive = false;
  winnerText.textContent = message;
  statusText.textContent = 'Game Over';

  if (message.includes('X')) scoreX++;
  else if (message.includes('O')) scoreO++;

  document.getElementById('scoreX').textContent = `Player X: ${scoreX}`;
  document.getElementById('scoreO').textContent = `Player O: ${scoreO}`;

  // 🔊 Sound for win/draw
  if (message.includes('Draw')) {
    drawSound.currentTime = 0;
    drawSound.play();
  } else {
    winSound.currentTime = 0;
    winSound.play();
  }

  // 🎨 Show win modal
  winMessage.textContent = `🎉 ${message}`;
  winModal.style.display = 'flex';
}

// 🔁 Reset
resetBtn.addEventListener('click', resetGame);
function resetGame() {
  board.fill('');
  cells.forEach(c => c.textContent = '');
  currentPlayer = 'X';
  statusText.textContent = 'Player X Turn';
  winnerText.textContent = '';
  gameActive = true;
}

// ↩️ Undo
undoBtn.addEventListener('click', () => {
  if (!movesHistory.length) return;
  const lastMove = movesHistory.pop();
  board[lastMove] = '';
  cells[lastMove].textContent = '';
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer} Turn`;
  gameActive = true;
});
