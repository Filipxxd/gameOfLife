// initial values
const rows = 24,
  cols = 24,
  gridContainer = document.getElementById('gridContainer');

let playing = false;

let grid = new Array(rows);
let nextGrid = new Array(rows);

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
      grid[i][j] = 0;
      nextGrid[i][j] = 0;
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
    clearButton = document.getElementById('clear');

  startButton.onclick = startButtonHandler;
  clearButton.onclick = clearButtonHandler;
}

// check promene playing, meni nazev start/pause btn, spusti hru
function startButtonHandler() {
  if (playing) {
    this.innerHTML = 'START';
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
}

function play() {
  computeNextGen();
}

function computeNextGen() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      applyRules(i, j);
    }
  }
}

function applyRules(row, column) {
  let numNeighbors = countNeighbours(row, column);

  //aplikace pravidel
  if (grid[row][column] === 1) {
    // pravidla pro zivou
    // pokud mene nez 2 sousedi, umira
    if (numNeighbors < 2) {
      nextGrid[row][colum] = 0;
    }
    // pokud 2 / 3 sousedi, zije
    else if (numNeighbors === 2 || numNeighbors === 3) {
      nextGrid[row][colum] = 1;
    }
    // pokud vic jak 3 susedi, umira
    else if (numNeighbors > 3) {
      nextGrid[row][colum] = 0;
    }
  } else if (grid[row][column] === 0) {
    //pravidla pro mrtvou
    if (numNeighbors === 3) {
      nextGrid[row][colum] = 1;
    }
  }
}

function countNeighbours(row, column) {
  let count = 0;
  console.log('xd');
  return count;
}

window.onload = init();
