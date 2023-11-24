const board = document.querySelector(".board");
const timer = document.querySelector("#time");
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
    // Set variables
    this.index = index;
    this.isBomb = false;
    this.isUncovered = false;
    this.numOfNearBombs = 0;
    this.isFlagged = false;

    this.element = document.createElement("div");

    // Set properties
    this.element.setAttribute("index", this.index);
    this.index % 2 == 0 ? (this.isBright = true) : (this.isBright = false);
    this.isBright
      ? (this.element.className = `cell brightCell`)
      : (this.element.className = `cell darkCell`);

    this.AddClickEvents();

    board.appendChild(this.element);
  }

  // Add listening for events
  AddClickEvents() {
    // Discovering fields
    this.element.addEventListener("click", () => {
      this.isBomb ? GameOver() : this.Discover();
    });

    // Set flags
    this.element.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      if (this.isFlagged) {
        RemoveFlag();
      } else {
        this.SetFlag();
      }
    });
  }

  SetFlag() {
    if (howManyFlagsLeft > 0 && !this.isUncovered) {
      this.isFlagged = true;
      this.element.innerHTML =
        '<span class="material-symbols-outlined"> flag </span>';
      this.element.querySelector("span").style.visibility = "visible";
      howManyFlagsLeft--;
      flags.innerHTML = howManyFlagsLeft;
    }
  }

  RemoveFlag() {
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
      if (toDiscover === boardSize - numOfBombs) {
        Timer();
      }

      this.isUncovered = true;
      this.isBright
        ? (this.element.className = `cell brightCellUncovered`)
        : (this.element.className = `cell darkCellUncovered`);
      this.element.querySelector("span").style.visibility = "visible";
      toDiscover--;
      CheckWin();
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

  UpdateNumbers() {
    this.element.innerHTML = `<span>${this.numOfNearBombs || ""}</span>`;
  }
}

// Clearing board
function ClearBoard() {
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
}

// Change timer
function Timer() {
  intervalID = setInterval(() => {
    timer.innerHTML = parseInt(timer.innerHTML) + 1;
  }, 1000);
}

// Preparing for a new game
function NewGame() {
  ClearBoard();

  howManyFlagsLeft = numOfBombs;
  toDiscover = boardSize - numOfBombs;

  flags.innerHTML = numOfBombs;

  // Clear timer
  timer.innerHTML = 0;
  clearInterval(intervalID);

  // Creating a new board
  const cells = [];

  for (let i = 0; i < boardSize; i++) {
    const cell = new Cell(i);
    cells.push(cell);
  }

  // Placing bomb on board
  for (let i = 0; i < numOfBombs; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * boardSize);
    } while (cells[randomIndex].isBomb);

    cells[randomIndex].PlaceBomb(cells);
  }

  // Placing numbers on board
  cells.forEach((cell) => {
    !cell.isBomb ? cell.UpdateNumbers() : null;
  });
}

function CheckWin() {
  if (toDiscover === 0) {
    alert("You Win!");
    NewGame();
  }
}
function GameOver() {
  alert("You Lose!");
  NewGame();
}

document.addEventListener("DOMContentLoaded", NewGame);
newGameBtn.addEventListener("click", NewGame);
