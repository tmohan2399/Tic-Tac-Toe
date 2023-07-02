const X_CLASS = "x";
const O_CLASS = "o";
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const gameGrid = document.getElementById("game-board");
const board = document.querySelector(".board");
const cells = [...document.querySelectorAll("[data-cell]")];
const winningMessageText = document.querySelector(
  "[data-winning-message-text]"
);
const winningMessage = document.getElementsByClassName("winning-message");
const xScoreBoard = document.querySelector('[data-mark="x"]');
const oScoreBoard = document.querySelector('[data-mark="o"]');
let circleTurn;
let xTotalScore = 0;
let oTotalScore = 0;

function startGame() {
  cells.forEach((cell) => {
    cell.className = "cell";
    cell.addEventListener("click", handeClick, { once: true });
  });

  circleTurn = Math.random() > 0.5;
  gameGrid.dataset.value = circleTurn ? O_CLASS : X_CLASS;
  winningMessage[0].classList.remove("show");
  document.querySelector(".strike-through")?.remove();

  ["horizontal-partition", "vertical-partition"].forEach((className) =>
    [...document.getElementsByClassName(className)].forEach((element) => {
      element.classList.remove(className);
      setTimeout(() => element.classList.add(className), 0);
    })
  );
}

function stopInteractions() {
  cells.forEach((cell) => cell.removeEventListener("click", handeClick));
}

function handeClick(e) {
  const currentClass = circleTurn ? O_CLASS : X_CLASS;

  e.target.classList.add(currentClass);

  const winningCombination = winner(currentClass);
  if (winningCombination) {
    calculateScore();
    stopInteractions();
    const winningText = (circleTurn ? "O" : "X") + " wins!";

    addStrikeThrough(winningCombination).addEventListener(
      "animationend",
      () => {
        winningMessageText.innerText = winningText;
        winningMessage[0].classList.add("show");
      },
      { once: true }
    );
  } else if (isDraw()) {
    winningMessage[0].classList.add("show");
    winningMessageText.innerText = "Draw";
    calculateScore(0.5);
  }

  gameGrid.dataset.value = (circleTurn = !circleTurn) ? O_CLASS : X_CLASS;
}

function winner(currentClass) {
  return winningCombinations.find((combination) =>
    combination.every((index) => cells[index].classList.contains(currentClass))
  );
}

function isDraw() {
  return cells.every(
    (cell) =>
      cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)
  );
}

function addStrikeThrough(winningCombination) {
  const strikeThroughElement = document.createElement("div");
  strikeThroughElement.dataset.code = winningCombination.join("-");
  strikeThroughElement.className = "strike-through";
  strikeThroughElement.style.setProperty(
    "background-color",
    circleTurn ? "hsl(45deg 54% 88%)" : "black"
  );
  board.append(strikeThroughElement);

  return strikeThroughElement;
}

function calculateScore(score) {
  const xScore = score || (circleTurn ? 0 : 1);
  xTotalScore += xScore;
  oTotalScore += 1 - xScore;
  xScoreBoard.querySelector("[data-score]").textContent = xTotalScore;
  oScoreBoard.querySelector("[data-score]").textContent = oTotalScore;
}

function restartGame(button) {
  startGame();
  button.classList.add("scale");
  button.onanimationend = function animationend() {
    button.classList.remove("scale");
    button.onanimationend = null;
  };
}

startGame();
document
  .querySelectorAll('button[data-key="restart"]')
  .forEach((button) => (button.onclick = () => restartGame(button)));
