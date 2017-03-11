
// Rules:
//
// A cell is born if it has 3 neighbors
// A cell remains alive if has only 2 or 3 neighbors

const maxX = 40;//screen.availWidth;
const maxY = 40;//screen.availHeight;

const squareSize = 10;

const state = {
  paused: true,
  clicking: false
};

const canvas = document.querySelector('canvas');

canvas.width = maxX * 10;
canvas.height = maxY * 10;

const grid = Array(maxX).fill(null).map(n => Array(maxY).fill(0));
const vGrid = Array(maxX).fill(null).map(n => Array(maxY).fill(0));
const context = canvas.getContext('2d');

function fillSquare(x, y) {
  context.fillRect(x + .5, y + .5, squareSize, squareSize);
}

function emptySquare(x, y) {
  context.clearRect(x, y, squareSize, squareSize);
}

function generate() {
  grid.forEach((line, x) => {
    line.forEach((value, y) => {
      getChanges(x, y);
    });
  });

  vGrid.forEach((line, x) => {
    line.forEach((value, y) => {
      applyChanges(x, y);
    });
  });
}

function getValue(x, y) {
  if (x < 0 || x > 39) return;

  return grid[x][y];
}

function getChanges(x, y) {
  const neighbors = [
    getValue(x - 1, y),
    getValue(x + 1, y),
    getValue(x, y - 1),
    getValue(x, y + 1),
    getValue(x - 1, y - 1),
    getValue(x + 1, y + 1),
    getValue(x - 1, y + 1),
    getValue(x + 1, y - 1)
  ].filter(n => n === 1).length;

  if (neighbors < 2 || neighbors > 3) {
    vGrid[x][y] = 0;
  } else if (neighbors === 3) {
    vGrid[x][y] = 1;
  }
}

function applyChanges(x, y) {
  const newVal = vGrid[x][y];

  newVal === 1 ? createCell(x, y) : killCell(x, y);
}

function tick() {
  requestAnimationFrame(() => {
    if (!state.paused) {
      generate();
    }
    tick();
  });
}

function createCell(x, y) {
  grid[x][y] = 1;
  fillSquare(round(x * 10), round(y * 10));
}

function killCell(x, y) {
  grid[x][y] = 0;
  emptySquare(round(x * 10), round(y * 10));
}

function round(n) {
  return 10.0 * Math.round(n / 10.0);
}

function down(event) {
  state.clicking = true;
}

function up(event) {
  state.clicking = false;
}

function onDrag(event) {
  if (!state.clicking && event.type !== 'touchmove') {
    return;
  }

  const x = Math.ceil(event.x / 10) - 1;
  const y = Math.ceil(event.y / 10) - 1;

  createCell(x, y);
}

function handleTouch() {
  const x = Math.ceil(event.touches[0].pageX / 10) - 1;
  const y = Math.ceil(event.touches[0].pageY / 10) - 1;

  createCell(x, y);
}

canvas.addEventListener('mousedown', down);
canvas.addEventListener('mouseup', up);
canvas.addEventListener('mousemove', onDrag);
canvas.addEventListener('touchmove', handleTouch);

document.addEventListener('keypress', ({ which }) => which === 13 ? state.paused = !state.paused : null);

tick();

// setInterval(generate, 1000);

// function init() {
//   const positions = [
//     getRandomPosition(),
//     getRandomPosition()
//   ];
//
//   createCell(...positions);
//   fillSquare(...positions);
//   tick();
// }
