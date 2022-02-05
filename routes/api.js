"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");
let solver = new SudokuSolver();

module.exports = function (app) {
  app.route("/api/check").post((req, res) => {
    if (
      !req.body.hasOwnProperty("puzzle") ||
      !req.body.hasOwnProperty("coordinate") ||
      !req.body.hasOwnProperty("value")
    ) {
      return res.json({ error: "Required field(s) missing" });
    }
    const row =
      req.body.coordinate.toUpperCase().charCodeAt(0) - "A".charCodeAt(0) + 1;
    const column = parseInt(req.body.coordinate[1]);
    if (row < 0 || row > 8 || column < 0 || column > 8) {
      return res.json({ error: "Invalid coordinate" });
    }

    let value = req.body.value;
    const validInput = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    if (typeof value != "number") {
      value = parseInt(value);
    }
    if (!validInput.includes(value)) {
      return res.json({ error: "Invalid value" });
    }

    let puzzleString = solver.validate(req.body.puzzle);

    if (
      typeof puzzleString === "object" &&
      puzzleString.hasOwnProperty("error")
    ) {
      return res.json({ error: puzzleString.error });
    }

    let conflict = [];
    let valid = true;
    if (!solver.checkColPlacement(puzzleString, row, column, value)) {
      valid = false;
      conflict.push("column");
    }

    if (!solver.checkRowPlacement(puzzleString, row, column, value)) {
      valid = false;
      conflict.push("row");
    }

    if (!solver.checkRegionPlacement(puzzleString, row, column, value)) {
      valid = false;
      conflict.push("region");
    }

    let result = {};
    result.valid = valid;
    if (conflict.length != 0) {
      result.conflict = conflict;
    }
    return res.json(result);
  });

  app.route("/api/solve").post((req, res) => {
    let validated = solver.validate(req.body.puzzle);
    console.log("API SOLVE", req.body.puzzle);
    console.log(validated);
    if (typeof validated != "string") {
      return res.send(validated);
    }
    try {
      let returnArray = solver.solve(req.body.puzzle);
      if (returnArray.hasOwnProperty("error")) {
        return res.send(returnArray);
      } else {
        let returnObject = { solution: returnArray[0] };
        return res.send(returnObject);
      }
    } catch (err) {
      return res.send(err);
    }
  });

  app.route("/api/slowsolve").post((req, res) => {
    res.send({ puzzle: solver.solve(req.body.puzzle, true) });
  });
};
