document.getElementById('game-setup').addEventListener('submit', function (e) {
    e.preventDefault();
    const n = parseInt(document.getElementById('grid-size').value);
    const m = parseInt(document.getElementById('win-streak').value);
    if (m > n) {
        alert('Win streak (m) must be less than or equal to grid size (n).');
        return;
    }
    startGame(n, m);
});

let board = [];
let currentPlayer = 'X';
let gameActive = true;

function startGame(n, m) {
    board = Array(n).fill().map(() => Array(n).fill(''));
    currentPlayer = 'X';
    gameActive = true;
    renderBoard(n);
    document.getElementById('game-status').innerText = `Player ${currentPlayer}'s turn`;
}

function renderBoard(n) {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${n}, 60px)`;
    gameBoard.style.gridTemplateRows = `repeat(${n}, 60px)`;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
    }
}

function handleCellClick(e) {
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;
    if (board[row][col] !== '' || !gameActive) {
        return;
    }
    board[row][col] = currentPlayer;
    e.target.innerText = currentPlayer;
    e.target.classList.add(currentPlayer.toLowerCase());
    if (checkWin(parseInt(row), parseInt(col))) {
        document.getElementById('game-status').innerText = `Player ${currentPlayer} wins!`;
        gameActive = false;
    } else if (board.flat().every(cell => cell !== '')) {
        document.getElementById('game-status').innerText = 'It\'s a draw!';
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        document.getElementById('game-status').innerText = `Player ${currentPlayer}'s turn`;
    }
}

function checkWin(row, col) {
    const n = board.length;
    const m = parseInt(document.getElementById('win-streak').value);

    const directions = [
        { dr: 0, dc: 1 }, // horizontal
        { dr: 1, dc: 0 }, // vertical
        { dr: 1, dc: 1 }, // diagonal down-right
        { dr: 1, dc: -1 } // diagonal down-left
    ];

    for (let { dr, dc } of directions) {
        let count = 1;
        for (let i = 1; i < m; i++) {
            const nr = row + dr * i;
            const nc = col + dc * i;
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && board[nr][nc] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        for (let i = 1; i < m; i++) {
            const nr = row - dr * i;
            const nc = col - dc * i;
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && board[nr][nc] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        if (count >= m) {
            return true;
        }
    }
    return false;
}
