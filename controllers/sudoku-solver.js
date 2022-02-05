class SudokuSolver {
  validate(puzzleString) {
    //The validate function should take a given puzzle
    // string and check if it has 81 valid chars
    if (puzzleString == undefined) {
      return { error: "Required field missing" };
    }
    let validRegex = /^[1-9\.]+$/g;
    if (!puzzleString.match(validRegex)) {
      return { error: "Invalid characters in puzzle" };
    }
    if (puzzleString.length != 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }
    return puzzleString;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    //Start & end index for row 1 are 0 and 8, row 2 are 9 and 17, row 3 are 18 and 26
    const startIndex = row * 9 - 9;
    const endIndex = row * 9 - 1;
    let rowString = "";
    for (let i = startIndex; i <= endIndex; i++) {
      if (i % 9 == column - 1) {
        if (puzzleString[i] == ".") {
          rowString += value;
        }
      } else {
        rowString += puzzleString[i];
      }
    }
    const duplicateRegex = /(\d).*\1/g;
    return !duplicateRegex.test(rowString);
  }

  checkColPlacement(puzzleString, row, column, value) {
    //Index of string for column 1 is 0, 9, 18, 27,...
    // column 2 is 1, 10, 19, 28,...
    let colString = "";
    for (let i = column - 1; i < puzzleString.length; i = i + 9) {
      if (Math.floor(i / 9) == row - 1) {
        if (puzzleString[i] == ".") {
          colString += value;
        } else {
          return false;
        }
      } else {
        colString += puzzleString[i];
      }
    }
    const duplicateRegex = /(\d).*\1/g;
    return !duplicateRegex.test(colString);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    //Index for region 1 are 0,1,2,9,10,11,18,19,20
    //          region 2 are 3,4,5,12,13,14,21,22,23
    //          region 3 are 6,7,8,15,16,17,24,25,26
    //          region 4 are 27,28,29,36,37,38,45,46,47
    //          region 5 are 30,31,32,39,40,41,48,49,50
    //          region 7 are 54
    //Row 1 col 2 is region 1
    // row 1 col 7 is region 3
    // row 5 col 4 is region 5
    // row 3 col 9 is region 6
    let regionString = "";
    const startRow = Math.floor(row / 3) * 3 + 1;
    const startColumn = Math.floor(column / 3) * 3 + 1;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startColumn; c < startColumn + 3; c++) {
        let i = this.getIndexFromRowColumn(r, c);
        if (r == row && c == column) {
          if (puzzleString[i] == ".") {
            regionString += value;
          } else {
            return false;
          }
        } else {
          regionString += puzzleString[i];
        }
      }
    }
    const duplicateRegex = /(\d).*\1/g;
    return !duplicateRegex.test(regionString);
  }

  getIndexFromRowColumn(row, column) {
    let region = Math.floor((row - 1) / 3) * 3 + Math.ceil(column / 3);
    let startIndex =
      (Math.ceil(region / 3) - 1) * 9 * 3 + ((region - 1) % 3) * 3;
    let index = startIndex + ((row - 1) % 3) * 9 + ((column - 1) % 3);
    return index;
  }

  solve(puzzleString, slow = false) {
    let board = [];
    board.push(convertPuzzleStringToArray(puzzleString));
    //printBoard(board);

    let updated = true,
      solved = false;
    while (updated && !solved) {
      updated = one_value_cell_constraint(board, slow);
      solved = is_solved(board);
    }
    //if (!solved) {
    //  board = backtrack_based(board, slow);
    //}

    if (slow) {
      let i = 0;
      let puzzleArray = [];
      while (i < board.length) {
        let puzzleString = convertPuzzleArrayToString(board[i]);
        puzzleArray.push(puzzleString);
        i++;
      }
      return puzzleArray;
    } else {
      let result = [];
      result.push(convertPuzzleArrayToString(board[board.length - 1]));
      return result;
    }
  }
}

function printBoard(board) {
  for (let r = 0; r < 9; r++) {
    let str = "";
    for (let c = 0; c < 9; c++) {
      if (c % 3 == 2) {
        if (board[r][c] == 0) {
          str += " " + "." + " ";
        } else {
          str += " " + board[r][c] + " ";
        }
        str += "|";
      } else {
        if (board[r][c] == 0) {
          str += " " + "." + " ";
        } else {
          str += " " + board[r][c] + " ";
        }
      }
    }
    console.log(str);
    if (r % 3 == 2) {
      console.log("----------" + "----------" + "----------");
    }
  }
}

function convertPuzzleStringToArray(puzzleString) {
  let board = [];
  let i = 0;
  while (i < puzzleString.length) {
    let rowArray = [];
    for (let r = 0; r < 9; r++) {
      if (puzzleString[i] == ".") {
        rowArray.push(0);
      } else {
        rowArray.push(parseInt(puzzleString[i]));
      }
      i++;
    }
    board.push(rowArray);
  }
  return board;
}

function convertPuzzleArrayToString(board) {
  let puzzleString = "";
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] == 0) {
        puzzleString += ".";
      } else {
        const regex = /^\d$/g;

        if (regex.test(board[r][c])) {
          puzzleString += board[r][c];
        } else {
          puzzleString += "*";
        }
      }
    }
  }
  return puzzleString;
}

function get_row(board, row) {
  // Given a board, we can return a single row
  return board[row];
}

function get_column(board, column) {
  // Given a board, we iterate the rows to return a column
  var col = [];
  for (let row = 0; row < 9; row++) {
    col.push(board[row][column]);
  }
  return col;
}

function get_square(board, square) {
  let cells = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (square == square_coordinates[r][c]) {
        cells.push(board[r][c]);
      }
    }
  }
  return cells;
}

function complete_cell(board, r, c, slow = false) {
  let used = [
    ...get_row(board[board.length - 1], r),
    ...get_column(board[board.length - 1], c),
    ...get_square(board[board.length - 1], square_coordinates[r][c]),
  ];
  let possibilities = [];
  for (let p = 1; p <= 9; p++) {
    if (!used.includes(p)) {
      possibilities.push(p);
    }
  }
  if (possibilities.length == 1) {
    //copy current board to the next index
    //if (slow) {
    //}
    // If there is only one valid possibility, fill it in
    board[board.length - 1][r][c] = possibilities[0];

    return true;
  } else {
    board[board.length - 1][r][c] = possibilities;
    return false;
  }
}

function appears_once_only(board, possibilities, segment, r, c, slow = false) {
  let updated = false;
  for (let i = 0; i < possibilities.length; i++) {
    let possibility = possibilities[i];
    let counter = 0;
    segment.forEach((cell) => {
      if (Array.isArray(cell)) {
        if (cell.includes(possibility)) {
          counter++;
        }
      } else {
        if (cell == possibility) {
          counter++;
        }
      }
    });
    if (counter == 1) {
      //copy current board to the next index
      //if (slow) {
      //}

      board[board.length - 1][r][c] = possibility;
      updated = true;
      break;
    }
  }
  return updated;
}

function compare(expected, actual) {
  let array1 = expected.slice();
  let array2 = actual.slice();
  return (
    array1.length === array2.length &&
    array1.sort().every(function (value, index) {
      return value === array2.sort()[index];
    })
  );
}

function is_solved(board) {
  let expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let valid = true;
  // Check all rows
  for (let r = 0; r < 9 && valid == true; r++) {
    if (!compare(expected, get_row(board, r))) {
      valid = false;
    }
  }
  // Check all columns
  for (let c = 0; c < 9 && valid == true; c++) {
    if (!compare(expected, get_column(board, c))) {
      valid = false;
    }
  }
  // Check all quadrants
  for (let q = 1; q < 9 && valid == true; q++) {
    if (!compare(expected, get_square(board, q))) {
      valid = false;
    }
  }
  return valid;
}

function backtrack_based(orig_board, slow) {
  // Create a temporary board for our recursion.
  let board = JSON.parse(JSON.stringify(orig_board));
  //printBoard(board);
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      // Process each incomplete cell
      if (board[board.length - 1][r][c] == 0) {
        complete_cell(board, r, c, slow);
        if (is_solved(board[board.length - 1])) return board;
        let cell = board[board.length - 1][r][c];
        // If we just created a list of possibilities, iterate them and recurse
        if (Array.isArray(cell)) {
          for (let i = 0; i < cell.length; i++) {
            // Create a temporary board for each recursion.
            let board_2 = JSON.parse(JSON.stringify(board));
            // Choose a value
            board_2[board.length - 1][r][c] = cell[i];
            // Recurse again using new board
            if ((board = backtrack_based(board_2, slow))) {
              return board;
            }
          }
          return false; // dead end
        }
      }
    }
  }

  return false;
}

// Constraint based pass.
// Apply the rules of Sudoku and mark up the cells we are
// 100% can only be a single value.
function one_value_cell_constraint(board, slow) {
  // Set to false at the start of the loop
  let updated = false;

  // Convert every gap into an array of possibilities
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[board.length - 1][r][c] == 0) {
        updated = complete_cell(board, r, c, slow) || updated;
      }
    }
  }

  // Look out for any possibility that appears as a possibility
  // once-only in the row, column, or quadrant.
  // If it does, fill it in!
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (Array.isArray(board[board.length - 1][r][c])) {
        let possibilities = board[board.length - 1][r][c];
        updated =
          appears_once_only(
            board,
            possibilities,
            get_row(board[board.length - 1], r),
            r,
            c,
            slow
          ) ||
          appears_once_only(
            board,
            possibilities,
            get_column(board[board.length - 1], c),
            r,
            c,
            slow
          ) ||
          appears_once_only(
            board,
            possibilities,
            get_square(board[board.length - 1], square_coordinates[r][c]),
            r,
            c,
            slow
          ) ||
          updated;
      }
    }
  }

  // Reinitialize gaps back to zero before ending
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (Array.isArray(board[board.length - 1][r][c])) {
        board[board.length - 1][r][c] = 0;
      }
    }
  }

  printBoard(board[board.length - 1]);

  return updated;
}

var square_coordinates = [
  [1, 1, 1, 2, 2, 2, 3, 3, 3],
  [1, 1, 1, 2, 2, 2, 3, 3, 3],
  [1, 1, 1, 2, 2, 2, 3, 3, 3],
  [4, 4, 4, 5, 5, 5, 6, 6, 6],
  [4, 4, 4, 5, 5, 5, 6, 6, 6],
  [4, 4, 4, 5, 5, 5, 6, 6, 6],
  [7, 7, 7, 8, 8, 8, 9, 9, 9],
  [7, 7, 7, 8, 8, 8, 9, 9, 9],
  [7, 7, 7, 8, 8, 8, 9, 9, 9],
];

module.exports = SudokuSolver;
