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

  const checkIfValidCell = function(row, col){
    const result = board[row][col];
    return !result;
  }

  const setCell = function(row, col, move){
    board[row][col] = move;
  }

  return {getBoard, setCell, setupBoard, checkIfValidCell};
})();

const GameController = (function(){
  const player1 = 'X';
  const player2 = 'O';
  let currentPlayer = 'X';
  let currentRound = 1;
  let winner = '';
  let gameMode = 'pvm';

  const playRound = function(cell){
    const row = getRow(cell);
    const col = getColumn(cell);
    if (winner || currentRound > 9 || !GameBoard.checkIfValidCell(row,col) ) return;

    GameBoard.setCell(row,col, currentPlayer);

    if (currentRound >= 5) checkIfWinner();
    if (winner || currentRound >= 9) return true;
    currentRound++;
    currentPlayer = currentPlayer == player1 ? player2 : player1;

    if (currentPlayer === player2 && gameMode === 'pvm') {
      const aiCell = getAiMove();
      playRound(aiCell);
    }
    return true;
  }

  const getRow = function(cell){
    return Math.floor(cell/3);
  }

  const getColumn = function(cell){
    return col = cell % 3;
  }

  const getAiMove = function(){
    while(true){
      const cell = Math.floor(Math.random()*9);
      const row = getRow(cell);
      const col = getColumn(cell);
      if (GameBoard.checkIfValidCell(row,col)) return cell;
    }
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
    } else if (currentRound === 9) ScreenUpdater.displayResults('Tie', currentRound);
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
      const validMove = GameController.playRound( +cell.dataset.index );
      if (validMove) displayBoard();
    }))
  }

  const playAgainBut = document.querySelector('.play-again');
  playAgainBut.addEventListener('click', () => {
    resetBoard();
    displayBoard();
  })

  const gameModeBut = document.querySelector('.game-mode');
  gameModeBut.addEventListener('click', () => {
    if (gameModeBut.classList.contains('pvp')){
      gameModeBut.classList.remove('pvp');
      gameModeBut.classList.add('pvm');
      gameModeBut.textContent = 'Player vs Machine';
    } else {
      gameModeBut.classList.add('pvp');
      gameModeBut.classList.remove('pvm');
      gameModeBut.textContent = 'Player vs Player';
    }
  })

  const displayResults = function(results, round){
    if (results === 'Tie') resultsElement.textContent = "It's a tie";
    else resultsElement.textContent = `${results} wins, on round ${round}!`;
    playAgainBut.classList.toggle('hidden');
  }

  return { displayBoard, displayResults };
})();

// Code execution starts here
ScreenUpdater.displayBoard();