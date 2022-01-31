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

  solve(puzzleString) {}
}

module.exports = SudokuSolver;
