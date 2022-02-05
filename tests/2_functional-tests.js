const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("POST check", function () {
    test("/POST check a puzzle placement with all fields", function (done) {
      const input = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "B3",
        value: 1,
      };

      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.property(res.body, "valid");
          assert.equal(res.body.valid, true);
          done();
        });
    });
    test("/POST check a puzzle placement single placement conflict", function (done) {
      const input = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "E6",
        value: 5,
      };

      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.property(res.body, "valid");
          assert.equal(res.body.valid, false);
          assert.property(res.body, "conflict");
          assert.deepEqual(res.body.conflict, ["column"]);
          done();
        });
    });
    test("/POST check a puzzle placement single placement conflict", function (done) {
      const input = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "F6",
        value: 2,
      };

      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.property(res.body, "valid");
          assert.equal(res.body.valid, false);
          assert.property(res.body, "conflict");
          assert.deepEqual(res.body.conflict, ["row"]);
          done();
        });
    });
    test("/POST check a puzzle placement single placement conflict", function (done) {
      const input = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "E7",
        value: 8,
      };

      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.property(res.body, "valid");
          assert.equal(res.body.valid, false);
          assert.property(res.body, "conflict");
          assert.deepEqual(res.body.conflict, ["region"]);
          done();
        });
    });
    test("/POST check a puzzle placement multiple placement conflict", function (done) {
      const input = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "H4",
        value: 4,
      };

      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.property(res.body, "valid");
          assert.equal(res.body.valid, false);
          assert.property(res.body, "conflict");
          assert.deepEqual(res.body.conflict, ["column", "row", "region"]);
          done();
        });
    });
    test("/POST check a puzzle with missing required fields", function (done) {
      const input = {
        coordinate: "H4",
        value: 4,
      };

      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.property(res.body, "error");
          assert.deepEqual(res.body, { error: "Required field(s) missing" });
          done();
        });
    });
    test("/POST check a puzzle with missing required fields", function (done) {
      const input = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        value: 4,
      };

      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.property(res.body, "error");
          assert.deepEqual(res.body, { error: "Required field(s) missing" });
          done();
        });
    });
    test("/POST check a puzzle with missing required fields", function (done) {
      const input = {
        coordinate: "H4",
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      };

      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.property(res.body, "error");
          assert.deepEqual(res.body, { error: "Required field(s) missing" });
          done();
        });
    });
    test("/POST check a puzzle with invalid characters in puzzle", function (done) {
      const input = {
        coordinate: "H4",
        puzzle:
          "a.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        value: 4,
      };

      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.property(res.body, "error");
          assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
          done();
        });
    });
    test("/POST check a puzzle with greater or less than 81 characters", function (done) {
      const input = {
        coordinate: "H4",
        puzzle:
          "...9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        value: 4,
      };

      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.property(res.body, "error");
          assert.deepEqual(res.body, {
            error: "Expected puzzle to be 81 characters long",
          });
          done();
        });
    });
    test("/POST check a puzzle with invalid coordinate", function (done) {
      const input = {
        coordinate: "J4",
        puzzle:
          "...9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        value: 4,
      };

      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.property(res.body, "error");
          assert.deepEqual(res.body, {
            error: "Invalid coordinate",
          });
          done();
        });
    });
    test("/POST check a puzzle with greater or less than 81 characters", function (done) {
      const input = {
        coordinate: "H4",
        puzzle:
          "...9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        value: 10,
      };

      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.property(res.body, "error");
          assert.deepEqual(res.body, {
            error: "Invalid value",
          });
          done();
        });
    });
  });
  suite("/POST solve function", function () {
    test("Solve a puzzle with valid puzzle string", (done) => {
      let puzzle = [
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        "135762984946381257728459613694517832812936745357824196473298561581673429269145378",
        "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
        "827549163531672894649831527496157382218396475753284916962415738185763249374928651",
      ];
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzle[0] })
        .end((err, res) => {
          assert.equal(res.body.solution, puzzle[1]);
        });
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzle[2] })
        .end((err, res) => {
          assert.equal(res.body.solution, puzzle[3]);
          done();
        });
    });
    test("/POST solve a puzzle with missing puzzle", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .end((err, res) => {
          assert.property(res.body, "error");
          assert.deepEqual(res.body, { error: "Required field missing" });
          done();
        });
    });
    test("/POST solve a puzzle with invalid characters in puzzle", function (done) {
      const input = {
        puzzle:
          "a.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      };

      chai
        .request(server)
        .post("/api/solve")
        .send(input)
        .end((err, res) => {
          assert.property(res.body, "error");
          assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
          done();
        });
    });
    test("/POST solve a puzzle with greater or less than 81 characters", function (done) {
      const input = {
        puzzle:
          "...9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      };

      chai
        .request(server)
        .post("/api/solve")
        .send(input)
        .end((err, res) => {
          assert.property(res.body, "error");
          assert.deepEqual(res.body, {
            error: "Expected puzzle to be 81 characters long",
          });
          done();
        });
    });
    test("Solve a puzzle that cannot be solved", (done) => {
      let puzzle = [
        "125..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      ];
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzle[0] })
        .end((err, res) => {
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });
});
