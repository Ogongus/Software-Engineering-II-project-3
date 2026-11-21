// Add one entry per game. Use the same id for its folder in public/builds/.
export const games = [
  {
    id: "minesweeper",
    title: "Minesweeper",
    description: "Use numbered clues to uncover safe tiles without hitting a mine.",
    goal: "Reveal every safe tile.",
    controls: "Click to reveal a tile. Right-click to mark a suspected mine.",
    rules: "A number counts the mines in the eight surrounding positions. Revealing a mine ends the game."
  },
  {
    id: "snake",
    title: "Snake",
    description: "[Placeholder]",
    goal: "[Placeholder]",
    controls: "[Placeholder]",
    rules: "[Placeholder]"
  },
  {
    id: "flappybird",
    title: "Flappy Bird",
    description: "[Placeholder]",
    goal: "[Placeholder]",
    controls: "[Placeholder]",
    rules: "[Placeholder]"
  },
  {
    id: "blackjack",
    title: "Black Jack",
    description: "[Placeholder]",
    goal: "[Placeholder]",
    controls: "[Placeholder]",
    rules: "[Placeholder]"
  },
  {
    id: "tetris",
    title: "Tetris",
    description: "[Placeholder]",
    goal: "[Placeholder]",
    controls: "[Placeholder]",
    rules: "[Placeholder]"
  },
  {
    id: "sudoku",
    title: "Sudoku",
    description: "A Sudoku puzzle game with three difficulty levels: Easy, Medium, and Hard. Players can generate new puzzles and check their answers.",
    goal: "Complete the 9x9 Sudoku grid by filling in the missing numbers correctly.",
    controls: "Select a difficulty level, click an empty cell, and enter a number from 1 to 9. Use the New Game button to start another puzzle and the Check Answer button to check your solution.",
    rules: "Fill every row, column, and 3x3 box with the numbers 1 through 9 without repeating any number. The puzzle is complete when all cells are filled correctly."
  }
];
