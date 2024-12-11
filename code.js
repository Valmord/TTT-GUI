const GameBoard = (function() {
  const ROWS = 3;
  const COLS = 3;
  const board = [];

  const setupBoard = function(){
    console.log(board);
      for (let row = 0; row < ROWS; row++) {
      board[row] = [];
      for (let col = 0; col < COLS; col++) {
        board[row].push('');
      }
    }
  }

  // Create board on run
  setupBoard();

  const getBoard = () => board;

  const printBoard = function(){
    for (let i = 0; i < board.length; i++){
      let current = `Row ${i+1}: [`;
      for (let j = 0; j < board[i].length; j++) {
        current += board[i][j]
        if (j < 2) current += ',';
      }
      current += ']'
      console.log(current);
    }
  }

  const setCell = function(cell, move){
    // Cell 0-2 are row 1, 3-5 are row 2 etc.
    const row = Math.floor(cell/3);
    const col = cell % 3;
  
    if (board[row][col]) {
      return false; 
    }
    board[row][col] = move;
    return true;
  }

  return {getBoard, setCell, setupBoard};
})();

const GameController = (function(){
  const player1 = 'X';
  const player2 = 'O';
  let currentPlayer = 'X';
  let currentRound = 1;
  let winner = '';

  const playRound = function(cell){
    if (winner || currentRound > 9) return;
    const validMove = GameBoard.setCell( cell, currentPlayer);
    if (!validMove) return;

    if (currentRound++ >= 5) checkIfWinner();
    currentPlayer = currentPlayer == player1 ? player2 : player1;
  }

  const reset = function(){
    currentRound = 1;
    winner = '';
    currentPlayer = 'X';
  }

  const checkIfWinner = function(){
    const board = GameBoard.getBoard();
    if (board[0][0] === board[0][1] && board[0][0] === board[0][2] && board[0][0] !== '' ||
        board[1][0] === board[1][1] && board[1][0] === board[1][2] && board[1][0] !== '' || 
        board[2][0] === board[2][1] && board[2][0] === board[2][2] && board[2][0] !== '' || 
        board[0][0] === board[1][0] && board[0][0] === board[2][0] && board[0][0] !== '' ||
        board[0][1] === board[1][1] && board[0][1] === board[2][1] && board[0][1] !== '' ||
        board[0][2] === board[1][2] && board[0][2] === board[2][2] && board[0][2] !== '' ||
        board[0][0] === board[1][1] && board[0][0] === board[2][2] && board[0][0] !== '' ||
        board[2][0] === board[1][1] && board[2][0] === board[0][2] && board[2][0] !== '' ) {
      winner = currentPlayer;
      ScreenUpdater.displayResults(winner, currentRound);
    } else if (currentRound === 9) ScreenUpdater.displayResults('', currentRound);
  }

  return { playRound, reset };

})();

const ScreenUpdater = (function (){
  const boardElement = document.querySelector('.board');
  const resultsElement = document.querySelector('.results')

  const resetBoard = function(){
    resultsElement.textContent = '';
    boardElement.textContent = '';
    playAgainBut.classList.toggle('hidden');
    GameController.reset();
    GameBoard.setupBoard();
  }

  const displayBoard = function(){
    boardElement.textContent = '';
    const board = GameBoard.getBoard();
    let count = 0;
    for ( let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const cell = document.createElement('button');
        cell.textContent = GameBoard.getBoard()[i][j];
        cell.classList.add('cell');
        if (cell.textContent !== '') cell.classList.add('set');
        cell.dataset.index = count++;
        boardElement.appendChild(cell);
      }
    }
    addCellListeners();
  }

  const addCellListeners = function(){
    const cellElements = document.querySelectorAll('.cell');
    cellElements.forEach( cell => cell.addEventListener('click', () => {
      GameController.playRound( +cell.dataset.index );
      displayBoard();
    }))
  }

  const playAgainBut = document.querySelector('.play-again');
  playAgainBut.addEventListener('click', () => {
    resetBoard();
    displayBoard();
  })

  const displayResults = function(results = 'Tie', round){
    if (results === 'Tie') resultsElement.textContent = "It's a tie";
    else resultsElement.textContent = `${results} wins, on round ${round}!`;
    playAgainBut.classList.toggle('hidden');
  }

  return { displayBoard, displayResults };
})();

// Code execution starts here
ScreenUpdater.displayBoard();