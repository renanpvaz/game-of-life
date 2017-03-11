function Life({ width, height, onCreateCell, onKillCell }) {
  const grid = Array(width).fill(null).map(n => Array(height).fill(false));
  const vGrid = Array(width).fill(null).map(n => Array(height).fill(false));

  const valueAt = (x, y) => (x < 0 || x > width - 1) ? undefined : grid[x][y];

  const applyRules = (x, y) => {
    const isAlive = valueAt(x, y);
    let total = 0;

    if(valueAt(x - 1, y)) ++total;
    if(valueAt(x + 1, y)) ++total;
    if(valueAt(x, y - 1)) ++total;
    if(valueAt(x, y + 1)) ++total;
    if(valueAt(x - 1, y - 1)) ++total;
    if(valueAt(x + 1, y + 1)) ++total;
    if(valueAt(x - 1, y + 1)) ++total;
    if(valueAt(x + 1, y - 1)) ++total;

    vGrid[x][y] = isAlive && (total === 2 || total == 3) || !isAlive && total === 3;
  };

  return {
    valueAt,

    update() {
      for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
          applyRules(x, y);
        }
      }

      for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
          vGrid[x][y] ? this.createCell(x, y) : this.killCell(x, y)
        }
      }
    },

    createCell(x, y) {
      if (!grid[x][y]) {
        grid[x][y] = true;
        onCreateCell(x, y);
      }
    },

    killCell(x, y) {
      if (grid[x][y]) {
        grid[x][y] = false;
        onKillCell(x, y);
      }
    }
  }
}
