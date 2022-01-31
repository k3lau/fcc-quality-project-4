const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
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
        console.log(JSON.stringify(res.body));
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
