/* Sunday Pencil Club — trivia engine + question bank.
   Powers both the themed quizzes (#themed-quiz) and the daily quiz (#daily-quiz).
   All facts are long-settled and checked; readers can report any error by email.
   Answers are the index into opts. */
(function () {
  "use strict";
  var BANK = [
    // ---- U.S. geography ----
    { c: "geography", q: "Which U.S. state is the largest by land area?", o: ["Texas", "Alaska", "California", "Montana"], a: 1 },
    { c: "geography", q: "What is the capital of New York State?", o: ["New York City", "Buffalo", "Albany", "Rochester"], a: 2 },
    { c: "geography", q: "The Grand Canyon is mostly in which state?", o: ["Nevada", "Utah", "Arizona", "Colorado"], a: 2 },
    { c: "geography", q: "Which of the Great Lakes is the largest?", o: ["Lake Michigan", "Lake Erie", "Lake Huron", "Lake Superior"], a: 3 },
    { c: "geography", q: "Which river is the longest in the United States?", o: ["Mississippi", "Missouri", "Colorado", "Ohio"], a: 1 },
    { c: "geography", q: "What is the capital of California?", o: ["Los Angeles", "San Francisco", "Sacramento", "San Diego"], a: 2 },
    { c: "geography", q: "Mount Rushmore is carved into a mountain in which state?", o: ["Wyoming", "South Dakota", "Montana", "Colorado"], a: 1 },
    { c: "geography", q: "Which state is nicknamed the Sunshine State?", o: ["California", "Arizona", "Florida", "Hawaii"], a: 2 },
    { c: "geography", q: "The Everglades are found in which state?", o: ["Louisiana", "Florida", "Georgia", "Texas"], a: 1 },
    { c: "geography", q: "Which two states are not connected to the others by land?", o: ["Alaska and Hawaii", "Maine and Texas", "Hawaii and Florida", "Alaska and Washington"], a: 0 },
    { c: "geography", q: "What is the capital of Texas?", o: ["Houston", "Dallas", "Austin", "San Antonio"], a: 2 },
    { c: "geography", q: "The Golden Gate Bridge is in which city?", o: ["Los Angeles", "Seattle", "Portland", "San Francisco"], a: 3 },

    // ---- Americana & everyday ----
    { c: "americana", q: "How many stripes are on the U.S. flag?", o: ["12", "13", "15", "50"], a: 1 },
    { c: "americana", q: "On which date is Independence Day celebrated?", o: ["July 1", "July 4", "June 14", "September 1"], a: 1 },
    { c: "americana", q: "What holiday is celebrated on the fourth Thursday of November?", o: ["Columbus Day", "Thanksgiving", "Veterans Day", "Labor Day"], a: 1 },
    { c: "americana", q: "The Statue of Liberty was a gift from which country?", o: ["England", "Spain", "France", "Italy"], a: 2 },
    { c: "americana", q: "What building is the official residence of the U.S. President?", o: ["The Capitol", "The White House", "Independence Hall", "Mount Vernon"], a: 1 },
    { c: "americana", q: "Which bird is the national emblem of the United States?", o: ["Wild turkey", "Bald eagle", "American robin", "Cardinal"], a: 1 },
    { c: "americana", q: "How many U.S. states are there?", o: ["48", "49", "50", "52"], a: 2 },
    { c: "americana", q: "What color are the stars on the U.S. flag?", o: ["Gold", "White", "Silver", "Blue"], a: 1 },
    { c: "americana", q: "Which coin features President Abraham Lincoln?", o: ["The nickel", "The dime", "The penny", "The quarter"], a: 2 },
    { c: "americana", q: "The Liberty Bell is located in which city?", o: ["Boston", "Philadelphia", "Washington, D.C.", "New York"], a: 1 },

    // ---- Nature ----
    { c: "nature", q: "What is the tallest type of tree in the world?", o: ["Oak", "Coast redwood", "Maple", "Pine"], a: 1 },
    { c: "nature", q: "Which insect makes honey?", o: ["Wasp", "Ant", "Honeybee", "Beetle"], a: 2 },
    { c: "nature", q: "How many legs does a spider have?", o: ["6", "8", "10", "12"], a: 1 },
    { c: "nature", q: "What do you call a baby frog?", o: ["Calf", "Tadpole", "Kit", "Fawn"], a: 1 },
    { c: "nature", q: "Which bird is known for its red breast and is a sign of spring?", o: ["Blue jay", "American robin", "Sparrow", "Crow"], a: 1 },
    { c: "nature", q: "What gas do plants take in that people breathe out?", o: ["Oxygen", "Nitrogen", "Carbon dioxide", "Helium"], a: 2 },
    { c: "nature", q: "A group of wolves is called a what?", o: ["Herd", "Pack", "Flock", "School"], a: 1 },
    { c: "nature", q: "Which season comes right after summer?", o: ["Spring", "Winter", "Autumn", "Monsoon"], a: 2 },
    { c: "nature", q: "What is the largest land animal?", o: ["Hippopotamus", "African elephant", "Rhinoceros", "Giraffe"], a: 1 },
    { c: "nature", q: "Monarch butterflies are famous for doing what each year?", o: ["Changing color", "Migrating long distances", "Living underwater", "Glowing at night"], a: 1 },
    { c: "nature", q: "Which of these is a citrus fruit?", o: ["Apple", "Grapefruit", "Pear", "Cherry"], a: 1 },
    { c: "nature", q: "What is the hardest natural substance?", o: ["Gold", "Iron", "Diamond", "Granite"], a: 2 },

    // ---- History & invention ----
    { c: "history", q: "Who is credited with inventing the practical light bulb?", o: ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Henry Ford"], a: 1 },
    { c: "history", q: "The first successful powered airplane flight was made by which brothers?", o: ["The Wright brothers", "The Marx brothers", "The Smith brothers", "The Kellogg brothers"], a: 0 },
    { c: "history", q: "Who was the first President of the United States?", o: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"], a: 2 },
    { c: "history", q: "In what year did the first man walk on the Moon?", o: ["1965", "1969", "1972", "1959"], a: 1 },
    { c: "history", q: "Which document begins with the words 'We the People'?", o: ["The Declaration of Independence", "The U.S. Constitution", "The Gettysburg Address", "The Bill of Rights"], a: 1 },
    { c: "history", q: "Who invented the telephone?", o: ["Thomas Edison", "Alexander Graham Bell", "Samuel Morse", "Guglielmo Marconi"], a: 1 },
    { c: "history", q: "The transcontinental railroad was completed in which decade?", o: ["1840s", "1860s", "1880s", "1900s"], a: 1 },
    { c: "history", q: "Which U.S. President is on the one-dollar bill?", o: ["Lincoln", "Jefferson", "Washington", "Franklin"], a: 2 },
    { c: "history", q: "Clara Barton founded which organization in America?", o: ["The Red Cross", "The Salvation Army", "The Peace Corps", "The Scouts"], a: 0 },

    // ---- Everyday knowledge ----
    { c: "everyday", q: "How many days are in a leap year?", o: ["364", "365", "366", "367"], a: 2 },
    { c: "everyday", q: "How many sides does a hexagon have?", o: ["5", "6", "7", "8"], a: 1 },
    { c: "everyday", q: "Water freezes at what temperature in Fahrenheit?", o: ["0°F", "32°F", "100°F", "212°F"], a: 1 },
    { c: "everyday", q: "How many minutes are in a full hour?", o: ["30", "45", "60", "100"], a: 2 },
    { c: "everyday", q: "Which meal is typically eaten in the morning?", o: ["Supper", "Breakfast", "Lunch", "Dinner"], a: 1 },
    { c: "everyday", q: "How many cards are in a standard deck (without jokers)?", o: ["48", "50", "52", "54"], a: 2 },
    { c: "everyday", q: "What do you call a shape with three sides?", o: ["Square", "Triangle", "Circle", "Pentagon"], a: 1 },
    { c: "everyday", q: "Which is a primary color?", o: ["Green", "Orange", "Red", "Purple"], a: 2 },
    { c: "everyday", q: "How many inches are in one foot?", o: ["10", "12", "14", "16"], a: 1 },
    { c: "everyday", q: "Water boils at what temperature in Fahrenheit at sea level?", o: ["100°F", "180°F", "212°F", "250°F"], a: 2 },
    { c: "everyday", q: "How many days are in the month of September?", o: ["28", "29", "30", "31"], a: 2 },
    { c: "everyday", q: "What is the usual number of innings in a baseball game?", o: ["7", "9", "11", "12"], a: 1 }
  ];
  window.PENCIL_BANK = BANK;

  var CATS = {
    geography: "U.S. Geography", americana: "Americana", nature: "Nature",
    history: "History & Invention", everyday: "Everyday Knowledge"
  };

  function quizBlock(questions, title) {
    var score = 0, answered = 0;
    var wrap = document.createElement("div");
    questions.forEach(function (item, qi) {
      var q = document.createElement("div"); q.className = "quiz";
      var opts = item.o.map(function (opt, oi) {
        return '<li><button type="button" class="quiz__opt" data-q="' + qi + '" data-o="' + oi + '">' + opt + "</button></li>";
      }).join("");
      q.innerHTML = '<p class="quiz__q">' + (qi + 1) + ". " + item.q + '</p><ul class="quiz__opts">' + opts + "</ul>";
      wrap.appendChild(q);
    });
    var bar = document.createElement("p"); bar.className = "quiz__bar"; bar.setAttribute("role", "status");
    bar.innerHTML = '<span id="' + title + '-score">Score: 0 of ' + questions.length + "</span>";
    wrap.appendChild(bar);

    wrap.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest(".quiz__opt") : null;
      if (!b) return;
      var qi = +b.getAttribute("data-q"), oi = +b.getAttribute("data-o");
      var box = b.closest(".quiz");
      if (box.getAttribute("data-done")) return;
      box.setAttribute("data-done", "1");
      answered++;
      var correct = questions[qi].a;
      box.querySelectorAll(".quiz__opt").forEach(function (btn) {
        var o = +btn.getAttribute("data-o");
        btn.disabled = true;
        if (o === correct) btn.classList.add("right");
        else if (o === oi) btn.classList.add("wrong");
      });
      if (oi === correct) score++;
      document.getElementById(title + "-score").textContent = "Score: " + score + " of " + questions.length +
        (answered === questions.length ? " — all done!" : "");
    });
    return wrap;
  }

  // ---- themed quizzes page ----
  var themed = document.getElementById("themed-quiz");
  if (themed) {
    Object.keys(CATS).forEach(function (cat) {
      var qs = BANK.filter(function (x) { return x.c === cat; }).slice(0, 6);
      var h = document.createElement("h2"); h.id = "quiz-" + cat; h.textContent = CATS[cat];
      themed.appendChild(h);
      themed.appendChild(quizBlock(qs, "t-" + cat));
    });
  }

  // ---- daily quiz page ----
  var daily = document.getElementById("daily-quiz");
  if (daily) {
    var now = new Date();
    var seed = now.getFullYear() * 1000 + (now.getMonth() * 31 + now.getDate());
    // deterministic shuffle by seed
    var idx = BANK.map(function (_, i) { return i; });
    for (var i = idx.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      var j = seed % (i + 1);
      var tmp = idx[i]; idx[i] = idx[j]; idx[j] = tmp;
    }
    var pick = idx.slice(0, 10).map(function (i) { return BANK[i]; });
    var dateLine = document.createElement("p");
    dateLine.innerHTML = "<strong>Today's ten questions</strong> — a fresh set each day. Come back tomorrow for ten more.";
    daily.appendChild(dateLine);
    daily.appendChild(quizBlock(pick, "daily"));
  }
})();
