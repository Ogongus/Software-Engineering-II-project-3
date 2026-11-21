
/*
Project 3: Sudoku Game
Programmer: Atique Danial
Course: EECS 581 - Software Engineering II
Team: Group 2
Description: Interactive Sudoku game with three difficulty levels.
Date: November 2026
Revision: 1.0
*/

const boardElement = document.getElementById("board");
const messageElement = document.getElementById("message");
const difficultyElement = document.getElementById("difficulty");

let solution = [];
let puzzle = [];

// Check whether a number can be placed in a cell.
function isValid(board, row, col, number) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === number ||
            board[i][col] === number) {
            return false;
        }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (board[r][c] === number) {
                return false;
            }
        }
    }

    return true;
}

// Shuffle numbers to create different boards.
function shuffle(numbers) {
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
}

// Generate a complete Sudoku solution.
function generateSolution() {
    const board = Array.from(
        { length: 9 }, () => Array(9).fill(0)
    );

    function fillBoard() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    const numbers = shuffle([1,2,3,4,5,6,7,8,9]);

                    for (const number of numbers) {
                        if (isValid(board, row, col, number)) {
                            board[row][col] = number;

                            if (fillBoard()) return true;

                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    fillBoard();
    return board;
}


// Count solutions, stopping when two are found.
function countSolutions(board, limit = 2) {
    let count = 0;

    function solve() {
        if (count >= limit) return;

        let bestRow = -1;
        let bestCol = -1;
        let bestOptions = null;

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] !== 0) continue;

                const options = [];
                for (let number = 1; number <= 9; number++) {
                    if (isValid(board, row, col, number)) {
                        options.push(number);
                    }
                }

                if (options.length === 0) return;

                if (bestOptions === null ||
                    options.length < bestOptions.length) {
                    bestRow = row;
                    bestCol = col;
                    bestOptions = options;
                }
            }
        }

        if (bestOptions === null) {
            count++;
            return;
        }

        for (const number of bestOptions) {
            board[bestRow][bestCol] = number;
            solve();
            board[bestRow][bestCol] = 0;

            if (count >= limit) return;
        }
    }

    solve();
    return count;
}



// Create a Sudoku puzzle with one unique solution.
function createPuzzle(board, difficulty) {
    const result = board.map(row => [...row]);

    const removals = {
        easy: 35,
        medium: 45,
        hard: 50
    };

    const target = removals[difficulty] ?? 35;

    const positions = shuffle(
        Array.from({ length: 81 }, (_, i) => i)
    );

    let removed = 0;

    for (const position of positions) {
        if (removed >= target) break;

        const row = Math.floor(position / 9);
        const col = position % 9;

        const original = result[row][col];
        result[row][col] = 0;

        // Keep the removal only if the solution is unique.
        const testBoard = result.map(row => [...row]);

        if (countSolutions(testBoard) === 1) {
            removed++;
        } else {
            result[row][col] = original;
        }
    }

    return result;
}


// Display the Sudoku board.
function displayBoard() {
    boardElement.innerHTML = "";

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement("input");

            cell.type = "text";
            cell.inputMode = "numeric";
            cell.maxLength = 1;
            cell.setAttribute(
                "aria-label",
                `Row ${row + 1}, Column ${col + 1}`
            );

            if (puzzle[row][col] !== 0) {
                cell.value = puzzle[row][col];
                cell.readOnly = true;
                cell.classList.add("fixed");
            } else {
                cell.addEventListener("input", () => {
                    cell.value = /^[1-9]$/.test(cell.value)
                        ? cell.value : "";
                    messageElement.textContent = "";
                });
            }

            if (row === 2 || row === 5) {
                cell.style.borderBottom = "3px solid #333";
            }

            if (col === 2 || col === 5) {
                cell.style.borderRight = "3px solid #333";
            }

            boardElement.appendChild(cell);
        }
    }
}

// Start a new game.
function newGame() {
    messageElement.textContent = "Generating puzzle...";

    // Allow the message to appear before generation.
    setTimeout(() => {
        solution = generateSolution();
        puzzle = createPuzzle(
            solution,
            difficultyElement.value
        );

        displayBoard();
        messageElement.textContent = "Good luck!";
    }, 0);
}

// Check the player's completed puzzle.
function checkAnswer() {
    const cells = boardElement.querySelectorAll("input");

    if (cells.length !== 81) return;

    let complete = true;
    let correct = true;

    cells.forEach((cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        const value = Number(cell.value);

        if (!cell.value) {
            complete = false;
        } else if (value !== solution[row][col]) {
            correct = false;
        }
    });

    if (!complete) {
        messageElement.textContent =
            "Please fill in all empty cells.";
    } else if (correct) {
        messageElement.textContent =
            "Congratulations! You solved the Sudoku!";
    } else {
        messageElement.textContent =
            "Some answers are incorrect. Try again!";
    }
}

document.getElementById("new-game")
    .addEventListener("click", newGame);

document.getElementById("check-answer")
    .addEventListener("click", checkAnswer);

// Automatically start a game when the page loads.
newGame();
