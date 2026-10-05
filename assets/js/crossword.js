/* Sunday Pencil Club — playable 7x7 mini crosswords. Original puzzles.
   Three puzzles share one block pattern; every across and down entry is a real
   word and every crossing letter is consistent (verified by construction).
   Keyboard friendly: type to fill, auto-advance, Backspace to go back. */
(function () {
  "use strict";
  var PUZZLES = [
    {
      theme: "Everyday",
      sol: ["LANDING", "A#####A", "NEITHER", "T##E##D", "EARACHE", "R#####N", "NAPKINS"],
      across: { 1: "A flat resting place partway up a staircase", 3: "Not one and not the other", 5: "A dull, throbbing pain in the side of the head", 6: "Cloth or paper squares used at the dinner table" },
      down: { 1: "An old-fashioned portable lamp", 2: "Plots where flowers and vegetables are grown", 4: "A hot drink brewed from leaves" }
    },
    {
      theme: "Around the House",
      sol: ["CANDLES", "A#####I", "BUTTONS", "I##O##T", "NURTURE", "E#####R", "TICKETS"],
      across: { 1: "Wax sticks with a wick, lit on a birthday cake", 3: "Round fasteners down the front of a shirt", 5: "To care for something and help it grow", 6: "Stubs you show to enter a show" },
      down: { 1: "A cupboard with shelves or drawers", 2: "Your female siblings", 4: "A very young child" }
    },
    {
      theme: "The Great Outdoors",
      sol: ["MORNING", "E#####A", "AMATEUR", "D##A##L", "OCARINA", "W#####N", "SEABIRD"],
      across: { 1: "The early part of the day", 3: "Someone who does a hobby for love, not pay", 5: "A small, egg-shaped wind instrument", 6: "A gull or a pelican, for example" },
      down: { 1: "Grassy fields full of wildflowers", 2: "A decorative ring of flowers or leaves", 4: "Black, sticky material used to surface a road" }
    }
  ];

  var SIZE = 7;
  var host = document.getElementById("crossword");
  if (!host) return;
  var current = 0;

  function build(p) {
    // number the grid
    var nums = [], n = 0, cellNum = {};
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        if (p.sol[r][c] === "#") continue;
        var startAcross = (c === 0 || p.sol[r][c - 1] === "#") && (c + 1 < SIZE && p.sol[r][c + 1] !== "#");
        var startDown = (r === 0 || p.sol[r - 1][c] === "#") && (r + 1 < SIZE && p.sol[r + 1][c] !== "#");
        if (startAcross || startDown) { n++; cellNum[r + "," + c] = n; }
      }
    }
    return cellNum;
  }

  function render() {
    var p = PUZZLES[current];
    var cellNum = build(p);
    var html = '<div class="puzzle-pick" role="group" aria-label="Choose a puzzle">';
    PUZZLES.forEach(function (pz, i) {
      html += '<button type="button" class="btn' + (i === current ? ' btn--solid' : '') + '" data-pick="' + i + '">' + pz.theme + '</button>';
    });
    html += '</div>';
    html += '<div class="xw" role="group" aria-label="Crossword grid, ' + p.theme + '">';
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        var ch = p.sol[r][c];
        if (ch === "#") { html += '<div class="xw__cell block" aria-hidden="true"></div>'; continue; }
        var num = cellNum[r + "," + c];
        html += '<div class="xw__cell">' +
          (num ? '<span class="xw__num">' + num + '</span>' : '') +
          '<input maxlength="1" inputmode="latin" autocomplete="off" aria-label="Row ' + (r + 1) + ' column ' + (c + 1) + '" data-r="' + r + '" data-c="' + c + '">' +
          '</div>';
      }
    }
    html += '</div>';
    html += '<p class="xw__msg" id="xwMsg" role="status"></p>';
    html += '<div class="toolbar"><button type="button" class="btn" id="xwCheck">Check</button>' +
      '<button type="button" class="btn" id="xwReveal">Reveal answers</button>' +
      '<button type="button" class="btn" id="xwClear">Clear</button>' +
      '<button type="button" class="btn btn--print" onclick="window.print()">Print</button></div>';

    // clues
    html += '<div class="cluecols">';
    html += '<div class="cluelist"><h3>Across</h3><ol>';
    Object.keys(p.across).sort(function (a, b) { return a - b; }).forEach(function (k) {
      html += '<li value="' + k + '">' + p.across[k] + '</li>';
    });
    html += '</ol></div>';
    html += '<div class="cluelist"><h3>Down</h3><ol>';
    Object.keys(p.down).sort(function (a, b) { return a - b; }).forEach(function (k) {
      html += '<li value="' + k + '">' + p.down[k] + '</li>';
    });
    html += '</ol></div></div>';

    host.innerHTML = html;
    wire();
  }

  function inputs() { return Array.prototype.slice.call(host.querySelectorAll(".xw input")); }

  function wire() {
    var ins = inputs();
    ins.forEach(function (inp, idx) {
      inp.addEventListener("input", function () {
        inp.value = inp.value.toUpperCase().replace(/[^A-Z]/g, "");
        inp.parentNode.classList.remove("correct");
        if (inp.value && idx + 1 < ins.length) ins[idx + 1].focus();
      });
      inp.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && !inp.value && idx > 0) { ins[idx - 1].focus(); }
      });
    });
    host.querySelectorAll("[data-pick]").forEach(function (b) {
      b.addEventListener("click", function () { current = +b.getAttribute("data-pick"); render(); });
    });
    document.getElementById("xwCheck").addEventListener("click", check);
    document.getElementById("xwReveal").addEventListener("click", reveal);
    document.getElementById("xwClear").addEventListener("click", clear);
  }

  function check() {
    var p = PUZZLES[current], ins = inputs(), right = 0, filled = 0, total = ins.length;
    ins.forEach(function (inp) {
      var r = +inp.getAttribute("data-r"), c = +inp.getAttribute("data-c");
      var want = p.sol[r][c];
      if (inp.value) filled++;
      if (inp.value === want) { inp.parentNode.classList.add("correct"); right++; }
      else { inp.parentNode.classList.remove("correct"); }
    });
    var msg = document.getElementById("xwMsg");
    if (right === total) msg.textContent = "Wonderful — every square is correct!";
    else if (filled < total) msg.textContent = right + " of " + total + " squares correct so far. Keep going.";
    else msg.textContent = right + " of " + total + " correct. The green squares are right; try the others again.";
  }

  function reveal() {
    var p = PUZZLES[current];
    inputs().forEach(function (inp) {
      var r = +inp.getAttribute("data-r"), c = +inp.getAttribute("data-c");
      inp.value = p.sol[r][c];
      inp.parentNode.classList.add("correct");
    });
    document.getElementById("xwMsg").textContent = "Answers revealed. Press a puzzle name above for a fresh one.";
  }

  function clear() {
    inputs().forEach(function (inp) { inp.value = ""; inp.parentNode.classList.remove("correct"); });
    document.getElementById("xwMsg").textContent = "";
  }

  render();
})();
