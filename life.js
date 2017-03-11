function Life({ width, height, onCreateCell, onKillCell }) {
  const grid = Array(width).fill(null).map(n => Array(height).fill(false));
  const vGrid = Array(width).fill(null).map(n => Array(height).fill(false));

  const valueAt = (x, y) => (x < 0 || x > width - 1) ? undefined : grid[x][y];

  const getNeighbors = (x, y) => [
    valueAt(x - 1, y),
    valueAt(x + 1, y),
    valueAt(x, y - 1),
    valueAt(x, y + 1),
    valueAt(x - 1, y - 1),
    valueAt(x + 1, y + 1),
    valueAt(x - 1, y + 1),
    valueAt(x + 1, y - 1)
  ];

  const applyRules = (x, y) => {
    const isAlive = valueAt(x, y);
    const total = getNeighbors(x, y).filter(value => value === true).length;

    vGrid[x][y] = isAlive && (total === 2 || total == 3) || !isAlive && total === 3;
  };

  return {
    valueAt,

    update() {
      grid.forEach((line, x) => {
        line.forEach((column, y) => applyRules(x, y))
      });

      vGrid.forEach((line, x) => {
        line.forEach((column, y) => {
          vGrid[x][y] ? this.createCell(x, y) : this.killCell(x, y);
        })
      });
    },

    createCell(x, y) {
      grid[x][y] = true;
      onCreateCell(x, y);
    },

    killCell(x, y) {
      grid[x][y] = false;
      onKillCell(x, y);
    }
  }
}
