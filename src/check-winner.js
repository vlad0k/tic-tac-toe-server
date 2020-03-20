const checkWinner = (table, count) =>  {
  const winArr = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

  for (let win of winArr) {
    const [a, b, c] = win;

    if (table[a] === table[b] && table[a] === table[c] && table[a]){
      return table[a];
    }
  }

  if (count === 9) {
    return 'Draw';
  }

  return null;
}

module.exports = checkWinner;
