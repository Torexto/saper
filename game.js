const board = document.querySelector(".board");
const time = document.querySelector("#time");
const newGameBtn = document.querySelector("#newGameBtn");
const flags = document.querySelector("#flags");

// Game Settings
let numOfBombs = 10;
let boardSize = 81;

// Global variable
let toDiscover = boardSize - numOfBombs;
let gameOver = false;
let intervalID;
let howManyFlagsLeft = numOfBombs;

class Cell {
  constructor(index) {
    this.index = index;
    this.isBomb = false;
    this.isUncovered = false;
    this.numOfNearBombs = 0;
    this.isFlagged = false;

    this.element = document.createElement("div");

    this.element.setAttribute("index", this.index);
    this.index % 2 == 0 ? (this.isBright = true) : (this.isBright = false);
    this.isBright
      ? (this.element.className = `cell brightCell`)
      : (this.element.className = `cell darkCell`);

    board.appendChild(this.element);
  }

  AddClickEvent() {
    this.element.addEventListener("click", () => {
      if (this.isBomb) {
        alert("You Lose!");
        NewGame();
      } else {
        this.Discover();
      }
    });

    this.element.addEventListener("mouseover", () => {
      document.addEventListener("keydown", this.SetFlag);
    });

    this.element.addEventListener("mouseout", () => {
      document.removeEventListener("keydown", this.SetFlag);
    });
  }

  SetFlag = (event) => {
    if (event.key === "f") {
      if (this.isFlagged) {
        this.Unflag();
      } else {
        this.Flag();
      }
    }
  };

  Flag() {
    if (howManyFlagsLeft > 0 && !this.isUncovered) {
      this.isFlagged = true;
      this.element.innerHTML =
        '<span class="material-symbols-outlined"> flag </span>';
      this.element.querySelector("span").style.visibility = "visible";
      howManyFlagsLeft--;
      flags.innerHTML = howManyFlagsLeft;
    }
  }

  Unflag() {
    this.isFlagged = false;
    this.element.querySelector("span").style.visibility = "hidden";
    this.element.innerHTML = `<span>${this.numOfNearBombs || ""}</span>`;
    howManyFlagsLeft++;
    flags.innerHTML = howManyFlagsLeft;
  }

  PlaceBomb(cells) {
    this.isBomb = true;
    this.element.innerHTML = "<span></span>";
    const neighbors = this.getNeighbors(cells);
    neighbors.forEach((neighbor) => {
      neighbor.numOfNearBombs++;
    });
  }

  Discover() {
    if (!this.isUncovered) {
      this.isUncovered = true;
      this.isBright
        ? (this.element.className = `cell brightCellUncovered`)
        : (this.element.className = `cell darkCellUncovered`);
      this.element.querySelector("span").style.visibility = "visible";
      toDiscover--;
      if (toDiscover === 0) {
        alert("You Win!");
        NewGame();
      }
    }
  }

  getNeighbors(cells) {
    const neighbors = [];
    const row = Math.floor(this.index / Math.sqrt(boardSize));
    const col = this.index % Math.sqrt(boardSize);

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const neighborRow = row + i;
        const neighborCol = col + j;
        const neighborIndex = neighborRow * Math.sqrt(boardSize) + neighborCol;

        if (
          neighborRow >= 0 &&
          neighborRow < Math.sqrt(boardSize) &&
          neighborCol >= 0 &&
          neighborCol < Math.sqrt(boardSize) &&
          neighborIndex !== this.index
        ) {
          neighbors.push(cells[neighborIndex]);
        }
      }
    }
    return neighbors;
  }
}

function ClearBoard() {
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
}

function Timer() {
  intervalID = setInterval(() => {
    time.innerHTML = parseInt(time.innerHTML) + 1;
  }, 1000);
}

function NewGame() {
  ClearBoard();

  howManyFlagsLeft = numOfBombs;

  toDiscover = boardSize - numOfBombs;
  flags.innerHTML = numOfBombs;

  time.innerHTML = 0;

  clearInterval(intervalID);

  Timer();

  const cells = [];

  for (let i = 0; i < boardSize; i++) {
    const cell = new Cell(i);
    cell.AddClickEvent();
    cells.push(cell);
  }

  for (let i = 0; i < numOfBombs; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * boardSize);
    } while (cells[randomIndex].isBomb);

    cells[randomIndex].PlaceBomb(cells);
  }

  cells.forEach((cell) => {
    if (!cell.isBomb) {
      cell.element.innerHTML = `<span>${cell.numOfNearBombs || ""}</span>`;
    }
  });
}

document.addEventListener("DOMContentLoaded", NewGame);
newGameBtn.addEventListener("click", NewGame);
