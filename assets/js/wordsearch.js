/* Sunday Pencil Club — playable word searches. Three themed grids built at load.
   Click the first and last letter of a word to find it. Works with keyboard too
   (Tab to a cell, Enter to pick). Reveal and Print provided. */
(function () {
  "use strict";
  var THEMES = [
    { id: "ws-geo", name: "American Places", words: ["DENVER", "BOSTON", "DALLAS", "MIAMI", "OREGON", "NEVADA", "ALASKA", "MAINE"] },
    { id: "ws-nat", name: "In the Garden", words: ["ROSE", "TULIP", "DAISY", "MAPLE", "FERN", "IVY", "LILAC", "ASTER"] },
    { id: "ws-kit", name: "In the Kitchen", words: ["KETTLE", "SPOON", "PLATE", "WHISK", "LADLE", "SIEVE", "TEAPOT", "APRON"] }
  ];
  var N = 11;
  var DIRS = [[0, 1], [1, 0], [1, 1], [-1, 1]];
  var LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function rnd(n) { return Math.floor(Math.random() * n); }

  function make(words) {
    var g = [], placed = [];
    for (var i = 0; i < N; i++) { g[i] = []; for (var j = 0; j < N; j++) g[i][j] = ""; }
    words.forEach(function (w) {
      var ok = false, tries = 0;
      while (!ok && tries++ < 300) {
        var d = DIRS[rnd(DIRS.length)], r = rnd(N), c = rnd(N);
        var er = r + d[0] * (w.length - 1), ec = c + d[1] * (w.length - 1);
        if (er < 0 || er >= N || ec < 0 || ec >= N) continue;
        var good = true, cells = [];
        for (var k = 0; k < w.length; k++) {
          var rr = r + d[0] * k, cc = c + d[1] * k;
          if (g[rr][cc] && g[rr][cc] !== w[k]) { good = false; break; }
          cells.push([rr, cc]);
        }
        if (!good) continue;
        cells.forEach(function (cell, k) { g[cell[0]][cell[1]] = w[k]; });
        placed.push({ word: w, cells: cells });
        ok = true;
      }
    });
    for (var a = 0; a < N; a++) for (var b = 0; b < N; b++) if (!g[a][b]) g[a][b] = LETTERS[rnd(26)];
    return { g: g, placed: placed };
  }

  function lineCells(r1, c1, r2, c2) {
    var dr = r2 - r1, dc = c2 - c1;
    var len = Math.max(Math.abs(dr), Math.abs(dc));
    if (len === 0) return null;
    var sr = dr === 0 ? 0 : dr / Math.abs(dr), sc = dc === 0 ? 0 : dc / Math.abs(dc);
    if (!(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) return null;
    var cells = [];
    for (var k = 0; k <= len; k++) cells.push([r1 + sr * k, c1 + sc * k]);
    return cells;
  }

  function init(theme) {
    var host = document.getElementById(theme.id);
    if (!host) return;
    var data = make(theme.words);
    var sel = [];
    var found = {};
    var html = '<div class="ws" style="grid-template-columns:repeat(' + N + ',1fr)" role="grid" aria-label="' + theme.name + ' word search">';
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      html += '<button type="button" class="ws__cell" role="gridcell" data-r="' + r + '" data-c="' + c + '" aria-label="' + data.g[r][c] + '">' + data.g[r][c] + '</button>';
    }
    html += '</div>';
    html += '<ul class="wordbank" aria-label="Words to find">';
    theme.words.forEach(function (w) { html += '<li data-word="' + w + '">' + w + '</li>'; });
    html += '</ul>';
    html += '<div class="toolbar"><button type="button" class="btn" data-reveal>Reveal all</button>' +
      '<button type="button" class="btn btn--print" onclick="window.print()">Print</button></div>';
    host.innerHTML = html;

    function cellEl(r, c) { return host.querySelector('.ws__cell[data-r="' + r + '"][data-c="' + c + '"]'); }
    function clearSel() { sel.forEach(function (p) { var e = cellEl(p[0], p[1]); if (e && !e.classList.contains("found")) e.classList.remove("sel"); }); sel = []; }

    host.querySelectorAll(".ws__cell").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var r = +btn.getAttribute("data-r"), c = +btn.getAttribute("data-c");
        if (sel.length === 0) { clearSel(); sel = [[r, c]]; btn.classList.add("sel"); return; }
        var cells = lineCells(sel[0][0], sel[0][1], r, c);
        if (!cells) { clearSel(); sel = [[r, c]]; btn.classList.add("sel"); return; }
        var str = cells.map(function (p) { return data.g[p[0]][p[1]]; }).join("");
        var rev = str.split("").reverse().join("");
        var hit = theme.words.filter(function (w) { return w === str || w === rev; })[0];
        if (hit && !found[hit]) {
          found[hit] = true;
          cells.forEach(function (p) { var e = cellEl(p[0], p[1]); e.classList.add("found"); e.classList.remove("sel"); });
          var li = host.querySelector('[data-word="' + hit + '"]'); if (li) li.classList.add("done");
        }
        clearSel();
      });
    });
    host.querySelector("[data-reveal]").addEventListener("click", function () {
      data.placed.forEach(function (pl) {
        pl.cells.forEach(function (p) { cellEl(p[0], p[1]).classList.add("found"); });
        var li = host.querySelector('[data-word="' + pl.word + '"]'); if (li) li.classList.add("done");
      });
    });
  }

  THEMES.forEach(init);
})();
