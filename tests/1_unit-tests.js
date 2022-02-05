const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("UnitTests", () => {
  suite("Solve function", function () {
    test("valid puzzle string pass the solver");

    test("invalid puzzle string fail the solver");

    test("solver returns the expected solution for an incomplete puzzle", function (done) {
      const inputString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      const correctOutput =
        "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
      const result = solver.solve(inputString);
      assert.equal(result[result.length - 1], correctOutput);
      done();
    });
  });

  suite("Check function", function () {
    test("valid puzzle string of 81 chars", (done) => {
      const testString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      const result = solver.validate(testString);
      assert.equal(result, testString);
      done();
    });
    test("invalid characters 1-9 and '.' in puzzle string", (done) => {
      const testString =
        "a.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      const result = solver.validate(testString);
      assert.deepEqual(result, { error: "Invalid characters in puzzle" });
      done();
    });
    test("puzzle string that is not 81 characters in length", (done) => {
      const testString =
        ".5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      const result = solver.validate(testString);
      assert.deepEqual(result, {
        error: "Expected puzzle to be 81 characters long",
      });
      done();
    });
    test("check for valid row placement", (done) => {
      const testString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      assert.equal(solver.checkRowPlacement(testString, 1, 2, 3), true);
      done();
    });
    test("check for invalid row placement", (done) => {
      const testString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      assert.equal(solver.checkRowPlacement(testString, 1, 2, 5), false);
      done();
    });
    test("check for valid col placement", (done) => {
      const testString =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      assert.equal(solver.checkColPlacement(testString, 1, 2, 1), true);
      done();
    });
    test("check for invalid col placement", (done) => {
      const testString =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      assert.equal(solver.checkColPlacement(testString, 1, 2, 5), false);
      done();
    });
    test("check for valid region placement", (done) => {
      const testString =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      assert.equal(solver.checkRegionPlacement(testString, 8, 5, 2), true);
      done();
    });
    test("check for invalid region placement", (done) => {
      const testString =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      assert.equal(solver.checkRegionPlacement(testString, 6, 5, 2), true);
      done();
    });
  });
});
