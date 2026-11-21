

"""
Project 3: Sudoku Game
Programmer: Atique Danial
Course: EECS 581 - Software Engineering II
Team: Group 2
Description: Sudoku puzzle generation and validation.
Python Version: 3.13
Date: 15 November 2026
Revision: 1.0
"""


import random


def is_valid(board, row, col, num):
    """Check if a number can be placed in a cell."""

    # Check the row.
    for c in range(9):
        if board[row][c] == num:
            return False

    # Check the column.
    for r in range(9):
        if board[r][col] == num:
            return False

    # Check the 3x3 box.
    start_row = (row // 3) * 3
    start_col = (col // 3) * 3

    for r in range(start_row, start_row + 3):
        for c in range(start_col, start_col + 3):
            if board[r][c] == num:
                return False

    return True


def generate_board():
    """Generate a complete Sudoku board."""

    board = [[0 for _ in range(9)] for _ in range(9)]

    def fill_board():
        for row in range(9):
            for col in range(9):
                if board[row][col] == 0:
                    numbers = list(range(1, 10))
                    random.shuffle(numbers)

                    for num in numbers:
                        if is_valid(board, row, col, num):
                            board[row][col] = num

                            if fill_board():
                                return True

                            board[row][col] = 0

                    return False

        return True

    fill_board()
    return board


if __name__ == "__main__":
    board = generate_board()

    print("Sudoku Board:")
    for row in board:
        print(row)
