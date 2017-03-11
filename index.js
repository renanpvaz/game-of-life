const width = Math.ceil(screen.availWidth / 10);
const height = Math.ceil(screen.availHeight / 10);

const squareSize = 10;

const state = {
  paused: true,
  clicking: false,
  dark: false
};

const canvas = document.querySelector('canvas');

canvas.width = width * 10;
canvas.height = height * 10;

const context = canvas.getContext('2d');

function toCellCoord(n) {
  return Math.ceil(n / 10) - 1;
}

function toCanvasCoord(n) {
  return 10.0 * Math.round(n / 10.0);
}

const game = Life({
  width,
  height,

  onCreateCell(x, y) {
    context.fillRect(
      toCanvasCoord(x * 10) + .5,
      toCanvasCoord(y * 10) + .5,
      squareSize,
      squareSize
    );
  },

  onKillCell(x, y) {
    context.clearRect(
      toCanvasCoord(x * 10) + .5,
      toCanvasCoord(y * 10) + .5,
      squareSize,
      squareSize
    );
  }
});

function handleDrag(event) {
  if (!state.clicking && event.type !== 'touchmove') return;

  const x = toCellCoord(event.x);
  const y = toCellCoord(event.y);

  if (game.valueAt(x, y) === false) {
    game.createCell(x, y);
  }
}

function handleTouch() {
  const { pageX: x, pageY: y } = event.touches[0];

  game.createCell(toCellCoord(x), toCellCoord(y));
}


canvas.addEventListener('mousedown', () => state.clicking = true);
canvas.addEventListener('mouseup', () => state.clicking = false);
canvas.addEventListener('mousemove', handleDrag);
canvas.addEventListener('touchmove', handleTouch);

document.addEventListener('keypress',
  ({ which }) => which === 13 ? state.paused = !state.paused : null
);

function tick() {
  if (!state.paused) {
    game.update();
  }

  requestAnimationFrame(tick);
}

tick();
