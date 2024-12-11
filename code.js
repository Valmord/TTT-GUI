const GameBoard = (function() {
  const ROWS = 3;
  const COLS = 3;
  const board = [];

  const setupBoard = function(){
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

  return {getBoard, printBoard, setCell, setupBoard};
})();

const GameController = (function(){
  const player1 = 'X';
  const player2 = 'O';
  let currentPlayer = 'X';

  const playRound = function(cell){
    const validMove = GameBoard.setCell( cell - 1,currentPlayer);
    if (!validMove) return;
    currentPlayer = currentPlayer == player1 ? player2 : player1;
  }

  return { playRound };

})();

const ScreenUpdater = (function (){
  const boardElement = document.querySelector('.board');

  const resetBoard = function(){
    boardElement.textContent = '';
    GameBoard.setupBoard();
  }

  const renderBoard = function(){
    const board = GameBoard.getBoard();
    let count = 0;
    for ( let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const cell = document.createElement('button');
        cell.classList.add('cell');
        cell.dataset.index = count++;
        boardElement.appendChild(cell);
      }
    }
  }

  return { renderBoard, resetBoard };
})();