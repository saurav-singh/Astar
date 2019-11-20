// ------------------------------------ ||
// Render Functions ------------------- ||
// ------------------------------------ ||

// ------------------------------------ ||
// Render Maze
// ------------------------------------ ||
const renderMaze = (row, col) => {
  const mazeWidth = col * 30 + col;
  $("#maze").css("width", mazeWidth);
  for (let r = 0; r < row; r++) {
    const mazeRow = document.createElement("div");
    mazeRow.id = "maze_row_" + r;
    mazeRow.className = "maze_row";
    $("#maze").append(mazeRow);
    for (let c = 0; c < col; c++) {
      const block = document.createElement("div");
      block.id = r + "" + c;
      block.className = "block";
      $("#maze_row_" + r).append(block);
    }
  }
};

// ------------------------------------ ||
// Plots a path cell
// ------------------------------------ ||
const plot = (node, type) => {
  let color = "#7af";
  if (type == "start") color = "#fae";
  if (type == "end") color = "#f55";
  const id = "#" + node.x + node.y;
  $(id).css("background-color", color);
};

// ------------------------------------ ||
// A* Functions ----------------------- ||
// ------------------------------------ ||

// ------------------------------------ ||
// Board Size
// ------------------------------------ ||
const row = 15;
const col = 15;

// ------------------------------------ ||
// Heuristic - Manhattan Distance
// ------------------------------------ ||
const heuristic = (cur, end) => {
  const X = Math.abs(cur.x - end.x);
  const Y = Math.abs(cur.y - end.y);
  const H = X + Y;
  return H;
};

// ------------------------------------ ||
// Cost - Distrance to a destination
// ------------------------------------ ||
const cost = (cur, dest) => {
  const X = Math.pow(dest.x - cur.x, 2);
  const Y = Math.pow(dest.y - cur.y, 2);
  const D = Math.sqrt(X + Y);
  return D;
};

// ------------------------------------ ||
// Determine if goal is found
// ------------------------------------ ||
const isGoal = (cur, end) => {
  return cur.x == end.x && cur.y == end.y;
};

// ------------------------------------ ||
// Check if a move is valid - bounds
// ------------------------------------ ||
const isValid = node => {
  if (node.x < 0 && node.x > row) return false;
  if (node.y < 0 && node.y > col) return false;
  return true;
};

// ------------------------------------ ||
// Retrieve all possible move from a cell
// ------------------------------------ ||
const neighbours = cur => {
  const childrens = [];

  // TOP
  c1 = {
    x: cur.x,
    y: cur.y - 1,
    p: cur
  };
  if (isValid(c1)) childrens.push(c1);

  // BOT
  c2 = {
    x: cur.x,
    y: cur.y + 1,
    p: cur
  };
  if (isValid(c2)) childrens.push(c2);

  // RIGHT
  c3 = {
    x: cur.x + 1,
    y: cur.y,
    p: cur
  };
  if (isValid(c3)) childrens.push(c3);

  // LEFT
  c4 = {
    x: cur.x - 1,
    y: cur.y,
    p: cur
  };
  if (isValid(c4)) childrens.push(c4);

  //TOP-LEFT
  c5 = {
    x: cur.x - 1,
    y: cur.y - 1,
    p: cur
  };
  if (isValid(c5)) childrens.push(c5);

  //TOP-RIGHT
  c6 = {
    x: cur.x + 1,
    y: cur.y - 1,
    p: cur
  };
  if (isValid(c6)) childrens.push(c6);

  //BOT-LEFT
  c7 = {
    x: cur.x - 1,
    y: cur.y + 1,
    p: cur
  };
  if (isValid(c7)) childrens.push(c7);

  //BOT-RIGHT
  c8 = {
    x: cur.x + 1,
    y: cur.y + 1,
    p: cur
  };
  if (isValid(c8)) childrens.push(c8);

  return childrens;
};

// ------------------------------------ ||
// Check if a move already taken
// ------------------------------------ ||
const alreadyExists = (N, p) => {
  let E = false;

  for (let i = 0; i < N.length; i++) {
    if (p.x == N[i].x && p.y == N[i].y) {
      E = true;
      break;
    }
  }
  return E;
};

// ------------------------------------ ||
// Random integer between min and max
// ------------------------------------ ||
const random = (min, max) => {
  return Math.floor(Math.random() * max + min);
};

// ------------------------------------ ||
// A* algorithm
// ------------------------------------ ||
function Astar() {
  var start = {
    x: random(0, row),
    y: random(0, col),
    G: 0,
    F: 0
  };

  const end = {
    x: random(0, row),
    y: random(0, col)
  };

  renderMaze(row, col);
  plot(start, "start");
  plot(end, "end");

  let open = [start];
  let closed = [];
  let path = [];

  plot(start, "start");
  plot(end, "end");

  while (open.length > 0) {
    goal = false;

    open.sort((a, b) => (a.F > b.F ? 1 : -1));

    cur = open.shift();

    if (!alreadyExists(path, cur)) {
      path.push(cur);
    }

    N = neighbours(cur);

    N.forEach(n => {
      let Add = true;

      if (isGoal(n, end)) {
        open.length = 0;
        goal = true;
      }

      if (goal) return;

      n.H = heuristic(n, end);
      n.G = cost(n.p, n) + cur.G;
      n.F = n.G + n.H;

      open.forEach(n2 => {
        if (n2.F) {
          if (n.x == n2.x && n.y == n2.y && n.F > n2.F) Add = false;
        }
      });

      closed.forEach(n2 => {
        if (n2.F) {
          if (n.x == n2.x && n.y == n2.y && n.F > n2.F) Add = false;
          else Add = true;
        }
      });

      if (goal) return;

      if (Add) {
        open.push(n);
      }
    });

    closed.push(cur);
  }

  return path;
}

// ------------------------------------ ||
// Main Function
// ------------------------------------ ||
$(document).ready(() => {

  // Retrive path
  path = Astar();

  // Retrieve length
  path_track = 0;
  path_end = path.length;

  const loop = setInterval(() => {
    // Render path
    plot(path[path_track++]);

    // Clear Loop and Reset
    if (path_track == path_end) {
      clearInterval(loop);
      setTimeout(() => {
        location.reload();
      }, 500);
    }
  
  // THE END! :)
  }, 100);
});
