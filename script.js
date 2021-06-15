// initial values
const rows = 36,
  cols = 36,
  gridContainer = document.getElementById('gridContainer');

let playing = false;

let grid = new Array(rows);
let nextGrid = new Array(rows);

let timer; // funkce na zajisteni opetovneho volani
const reproductionTime = 200; // v ms

function init() {
  createTable();
  setupControlButtons();
  initializeGrids();
  resetGrid();
}

// prace s polem (grid)
function initializeGrids() {
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
    nextGrid[i] = new Array(cols);
  }
}

function resetGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = nextGrid[i][j] = 0;
    }
  }
}

// po kliku na cell checkne class, nastavi jeji protiklad
function cellClickHandler() {
  let rowcol = this.id.split('_');
  let row = rowcol[0];
  let col = rowcol[1];
  if (this.getAttribute('class').includes('dead')) {
    grid[row][col] = 1;
    this.setAttribute('class', 'live');
  } else {
    grid[row][col] = 0;
    this.setAttribute('class', 'dead');
  }
}

function createTable() {
  const table = document.createElement('table');
  gridContainer.appendChild(table);

  for (let i = 0; i < rows; i++) {
    var tableRow = document.createElement('tr');
    table.appendChild(tableRow);

    for (let j = 0; j < cols; j++) {
      const cell = document.createElement('td');

      cell.setAttribute('id', i + '_' + j);
      cell.setAttribute('class', 'dead');

      cell.onclick = cellClickHandler;

      tableRow.appendChild(cell);
    }
  }
}

// start/stop, clear tlacitka
function setupControlButtons() {
  var startButton = document.getElementById('start'),
    clearButton = document.getElementById('clear'),
    randomButton = document.getElementById('rndom'),
    gunButton = document.getElementById('gunVzor');

  startButton.onclick = startButtonHandler;
  clearButton.onclick = clearButtonHandler;
  randomButton.onclick = randomButtonHandler;
  gunButton.onclick = gunButtonHandler;
}

// check promene playing, meni nazev start/pause btn, spusti hru

function gunButtonHandler() {
  //ctverec vlevo
  grid[5][0] = 1;
  grid[6][0] = 1;
  grid[5][1] = 1;
  grid[6][1] = 1;

  // ctverec vpravo
  grid[3][35] = 1;
  grid[3][34] = 1;
  grid[4][35] = 1;
  grid[4][34] = 1;

  //
  grid[1][24] = 1;
  grid[2][24] = 1;
  grid[2][22] = 1;
  grid[3][21] = 1;
  grid[4][21] = 1;
  grid[5][21] = 1;
  grid[3][20] = 1;
  grid[4][20] = 1;
  grid[5][20] = 1;
  grid[6][20] = 1;

  updateView();
}

function randomButtonHandler() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = Math.round(Math.random());
    }
  }
  updateView();
}

function startButtonHandler() {
  if (playing) {
    this.innerHTML = 'START';
    clearTimeout(timer);
  } else {
    this.innerHTML = 'PAUSE';
  }
  playing = !playing;
  play();
}

function clearButtonHandler() {
  playing = false;
  let startButton = document.getElementById('start');
  startButton.innerHTML = 'START';

  clearTimeout(timer);
  // nastaveni v gridu 0
  resetGrid();
  updateView();
}

function play() {
  computeNextGen();
  if (playing) {
    timer = setTimeout(play, reproductionTime);
  }
}

function computeNextGen() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      applyRules(i, j);
    }
  }
  copyAndResetGrid();
  updateView();
}

function copyAndResetGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = nextGrid[i][j];
      nextGrid[i][j] = 0;
    }
  }
}

function updateView() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.getElementById(i + '_' + j);
      if (grid[i][j] === 0) cell.setAttribute('class', 'dead');
      else cell.setAttribute('class', 'live');
    }
  }
}

function applyRules(row, column) {
  let numNeighbors = countNeighbours(row, column);
  // numNeighbors > 0 ? console.log(row, column, numNeighbors) : null;
  //aplikace pravidel
  if (grid[row][column] === 1) {
    // pravidla pro zivou
    // pokud mene nez 2 sousedi, umira
    if (numNeighbors < 2) {
      nextGrid[row][column] = 0;
    }
    // pokud 2 / 3 sousedi, zije
    else if (numNeighbors === 2 || numNeighbors === 3) {
      nextGrid[row][column] = 1;
    }
    // pokud vic jak 3 susedi, umira
    else if (numNeighbors > 3) {
      nextGrid[row][column] = 0;
    }
  } else if (grid[row][column] === 0) {
    //pravidla pro mrtvou
    if (numNeighbors === 3) {
      nextGrid[row][column] = 1;
    }
  }
}

function countNeighbours(row, column) {
  let count = 0;

  // 1 nad bunkou
  if (row - 1 >= 0) {
    if (grid[row - 1][column] === 1) count++;
  }

  //2 nad vlevo
  if (row - 1 >= 0 && column - 1 >= 0) {
    if (grid[row - 1][column - 1] === 1) count++;
  }
  //3 nad pravo
  if (row - 1 >= 0 && column + 1 < cols) {
    if (grid[row - 1][column + 1] === 1) count++;
  }
  //4 vlevo
  if (row - 1 >= 0 && column + 1 >= 0) {
    if (grid[row][column - 1] === 1) count++;
  }
  //5 vpravo
  if (column + 1 >= 0) {
    if (grid[row][column + 1] === 1) count++;
  }
  //6 dole
  if (row + 1 < rows) {
    if (grid[row + 1][column] === 1) count++;
  }
  //7 dole vlevo
  if (row + 1 < rows && column - 1 >= 0) {
    if (grid[row + 1][column - 1] === 1) count++;
  }
  //8 dole vpravo
  if (row + 1 < rows && column + 1 < cols) {
    if (grid[row + 1][column + 1] === 1) count++;
  }
  return count;
}

window.onload = init();
