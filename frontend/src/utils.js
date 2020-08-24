

export const calculateTotals = (grid) => {
  const totalRow = grid[grid.length-1];
  for(let i = 2; i < totalRow.length; ++i) {
    let sum = 0;
    for(let j = 1; j < grid.length-1; ++j) {      
      const value = parseFloat(grid[j][i].value);
      if(value) sum += value;
    }
    totalRow[i].value = sum;
  }
}